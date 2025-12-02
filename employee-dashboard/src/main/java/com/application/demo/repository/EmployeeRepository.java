package com.application.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.application.demo.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long>{

	Optional<Employee> findByUserId(Long userId);
	
	 @Query("SELECT e FROM Employee e " +
	           "WHERE (:name IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%',:name,'%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%',:name,'%'))) " +
	           "AND (:mobile IS NULL OR e.mobile LIKE CONCAT('%',:mobile,'%'))")
	 List<Employee> search(@Param("name") String name, @Param("mobile") String mobile);
}
