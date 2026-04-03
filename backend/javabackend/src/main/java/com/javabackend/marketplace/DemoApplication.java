// // package com.example.demo;

// // import org.springframework.boot.SpringApplication;
// // import org.springframework.boot.autoconfigure.SpringBootApplication;

// // @SpringBootApplication
// // public class DemoApplication {

// // 	public static void main(String[] args) {
// // 		SpringApplication.run(DemoApplication.class, args);
// // 	}

// // }

// package com.javabackend.marketplace;

// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// public class DemoApplication {

//     public static void main(String[] args) {
//         SpringApplication.run(DemoApplication.class, args);
//     }
// }

package com.javabackend.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // 🔥 ADD HERE
    @Bean
    CommandLineRunner initAdmin(UserRepository repo) {
        return args -> {
            if (repo.findByEmail("admin@gmail.com") == null) {

                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");

                admin.setPassword(
                    new BCryptPasswordEncoder().encode("admin123")
                );

                admin.setRole("ADMIN");

                repo.save(admin);

                // System.out.println("Admin user created:" + admin.getEmail() + " / admin123");
            }
        };
    }
}