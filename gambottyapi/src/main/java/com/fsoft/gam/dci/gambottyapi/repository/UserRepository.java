package com.fsoft.gam.dci.gambottyapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fsoft.gam.dci.gambottyapi.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public User findByAccount(String account);

    public boolean existsByAccount(String account);
}
