package org.ecommerce.ecommerce.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class RedisConfiguration {

    private String redisHost = "monorail.proxy.rlwy.net";

    private int redisPort = 16844;

    private String redisPass = "kTOLckDGfoENlMsOCaYmrlaGYZueAoPU";

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(redisHost, redisPort);
        configuration.setPassword(redisPass);
        configuration.setUsername("default");
        return new LettuceConnectionFactory(configuration);
    }
    @Bean
    public RedisTemplate<String, Object > redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<Object>(Object.class));
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new Jackson2JsonRedisSerializer<Object>(Object.class));
        template.afterPropertiesSet();
        return template;
    }
    @Bean
    public ObjectMapper redisObjectMapper()
    {
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalDateTime.class,new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
        module.addDeserializer(LocalDateTime.class,new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
        objectMapper.registerModule(module);
        return objectMapper;
    }



}
