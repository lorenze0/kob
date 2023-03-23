package com.kob.backend.controller.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController/*添看全部*/
public class UserController {

    @Autowired
    UserMapper userMapper;/*mybatisplus帮我们实现的*/

    @GetMapping("/user/all/")
    public List<User> getAll() {

        return userMapper.selectList(null);
    }

    /*查询*/
    @GetMapping("/user/{userId}/") /*含义就是得到pojo里的一个对象，pojo里的一个class就是数据库里的一个表，pojo里的一个对象就是数据库里的一行*/
    public User getuser(@PathVariable int userId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        return userMapper.selectOne(queryWrapper);
    }

    @GetMapping("/user/add/{userId}/{username}/{password}/")/*添加*/
    public String addUser(
            @PathVariable int userId,
            @PathVariable String username,
            @PathVariable String password){
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        User user= new User(userId, username, encodedPassword);
        userMapper.insert(user);
        return"Add user Successfully";
    }

    @GetMapping("/user/delete/{userId}/")/*删除*/
    public String deleteUser(@PathVariable int userId){
        userMapper.deleteById(userId);
        return"Delete User Successfully";
    }
}