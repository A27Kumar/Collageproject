package com.javabackend.marketplace.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.javabackend.marketplace.model.Request;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {

    List<Request> findByCollegeContainingIgnoreCase(String college);
    List<Request> findByCityContainingIgnoreCase(String city);
    List<Request> findByTitleContainingIgnoreCase(String keyword);
}