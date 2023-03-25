package com.kob.backend.service.user.bot;

import com.kob.backend.pojo.Bot;

import java.util.List;

public interface GetListService {
    List<Bot> getList();  //因为返回的是自己的所有bot，因为自己的userid是存在token里面的，所以不用传参数。
}
