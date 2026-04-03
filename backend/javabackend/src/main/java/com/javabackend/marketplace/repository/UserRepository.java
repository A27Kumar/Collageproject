package com.javabackend.marketplace.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.javabackend.marketplace.model.User;

public interface UserRepository extends MongoRepository<User, String> { 
    User findByEmail(String email);
}