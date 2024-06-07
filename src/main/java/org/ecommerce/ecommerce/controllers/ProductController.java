package org.ecommerce.ecommerce.controllers;

import com.github.javafaker.Faker;
import org.ecommerce.ecommerce.dtos.ProductDTO;
import org.ecommerce.ecommerce.dtos.ProductImageDTO;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.models.ProductImage;
import org.ecommerce.ecommerce.responses.ProductListResponse;
import org.ecommerce.ecommerce.responses.ProductResponse;
import org.ecommerce.ecommerce.services.impl.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping(value = "/uploadImages/{id}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(@PathVariable Long id,@ModelAttribute("files") List<MultipartFile> files) {
        try{
            Product product = productService.getProductById(id);
            files = files == null ? new ArrayList<MultipartFile>() : files;
            List<ProductImage> productImages = new ArrayList<>();
            for (MultipartFile file : files) {
                if(file != null)
                {
                    if(file.getSize() <= 0)
                    {
                        continue;
                    }
                    if(file.getSize() >= 1024 * 1024 * 10)
                    {
                        return ResponseEntity.badRequest().body("File size must be less than 10MB");
                    }
                    String contentType = file.getContentType();
                    System.out.println(contentType);
                    if(contentType == null || !contentType.startsWith("image/"))
                    {
                        return ResponseEntity.badRequest().body("File must be an image");
                    }

                    String uniqueFileName = storeFile(file);
                    ProductImage productImage =productService.createProductImage(product.getId(),
                            ProductImageDTO.builder()
                                    .image_url(uniqueFileName)
                                    .build()
                            );
                    productImages.add(productImage);
                }


            }
            return ResponseEntity.ok(product);

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    public String storeFile(MultipartFile file ) throws IOException
    {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String newFileName = UUID.randomUUID().toString()+"_"+fileName;

        //Đường dẫn Thuw mục lưu file ảnh
        Path path = Paths.get("uploads");
        if(!Files.exists(path))
        {
            Files.createDirectories(path);
        }
        //Tạo duong dan file den thu muc
        Path destination = Paths.get(path.toString(),newFileName);
        Files.copy(file.getInputStream(),destination, StandardCopyOption.REPLACE_EXISTING);
        return newFileName;
    }
    @GetMapping("/viewImages/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName)
    {
        try {
            Path path = Paths.get("uploads/",imageName);
            System.out.println(path.toString());
            UrlResource resource = new UrlResource(path.toUri());
            System.out.println(resource.toString());
            if(resource.exists()) {
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
            }else {
                return ResponseEntity.notFound().build();
            }


        }catch (Exception e)
        {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("")
    public ResponseEntity<?> getAllProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0", name = "category_id") Long categoryId,
            @RequestParam int page, @RequestParam int limit) {
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());
        Page<ProductResponse> products = productService.getAllProducts(keyword, categoryId, pageRequest);
        int totalPages = products.getTotalPages();
        List<ProductResponse> productResponses = products.getContent();
        return ResponseEntity.ok(ProductListResponse.builder()
                .productResponses(productResponses)
                .totalPage(totalPages)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ProductResponse.fromProduct(productService.getProductById(id)));
    }

    @PostMapping("")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            productService.createProduct(productDTO);
            return ResponseEntity.ok("Product created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO, BindingResult result) {
        try {

            if (result.hasErrors()) {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            productService.updateProduct(id, productDTO);
            return ResponseEntity.ok("Product updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Product update failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Product deletion failed");
        }
    }

    @PostMapping("/fakeProduct")
    public ResponseEntity<?> generateFakeProducts() {
        Faker faker = new Faker();
        for (int i = 0; i < 100; i++) {
            String productName = faker.commerce().productName();
            if (productService.existsByProductName(productName)) {
                continue;
            }
            ProductDTO productDTO = ProductDTO.builder()
                    .productName(productName)
                    .price((float) faker.number().numberBetween(10, 90_000_000))
                    .description(faker.lorem().sentence())
                    .thumbnail("")
                    .color(faker.color().name())
                    .size(faker.app().version())
                    .categoryId((long) faker.number().numberBetween(2, 2))
                    .build();
            try {
                productService.createProduct(productDTO);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.ok("Generate fake products successfully");
    }

    @GetMapping("/by-ids")
    public ResponseEntity<?> getProductsByIds(@RequestParam("ids") String ids) {
       try
       {
          List<Long> productIds = Arrays.stream(ids.split(",")).map(Long::parseLong).toList();
          List<Product> products = productService.getProductByIds(productIds);
          return ResponseEntity.ok(products);
       }catch (Exception e)
       {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }
}

