package org.ecommerce.ecommerce.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "products")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity{

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name",length = 350)
    private String name;
    @Column(name = "price",nullable = false)
    private double price;
    @Column(name = "thumbnail",length = 300)
    private String thumbnail;
    @Column(name = "description")
    private String description;
    @Column(name = "size",length = 20)
    private String size;
    @Column(name = "color",length = 20)
    private String color;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ProductImage> productImages;
}
