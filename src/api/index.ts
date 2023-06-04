import request from "../utils/request";

// 绘制区域弹窗指标内容
export function zoneDetail(communityName:any, ids: any) {
    return request({
        url: '/person/get_person_and_room_msg_by_buildings/?communityName=' + communityName +'&buildIds=' + ids,
        method: 'get'
    })
}

// 绘制区域弹窗列表内容
export function zoneList(communityName:any, ids: any) {
    return request({
        url: '/person/get_person_and_room_msg_by_buildings/?communityName=' + communityName +'&buildIds=' + ids,
        method: 'get'
    })
}

// 网格 grid、楼栋 building、单元 unit
export function getData(type: any, community: any) {
    return request({
        url: '/tbCommunity/getCommunityData?type=' + type + '&community=' + community,
        method: 'get'
    })
}

// 户室
export function getRoom(unitId: any, grid:any, building:any) {
    return request({
        url: '/tbRoom/getList?unitId=' + unitId + '&grid=' + grid+ '&building=' + building,
        method: 'get'
    })
}

// 房屋人员
export function getPerson(roomId: any) {
    return request({
        url: '/person/getList?roomId=' + roomId,
        method: 'get'
    })
}

// 房屋新增人员
export function insertPerson(data: any) {
    return request({
        url: '/person/save',
        method: 'post',
        data
    })
}

// 房屋人员删除
export function delPerson(userId: any) {
    return request({
        url: '/person/deleted/' + userId,
        method: 'post'
    })
}

// 左侧面板数据
export function getPanel(addr: any, community:any) {
    return request({
        url: '/tbTitle/getList?addr=' + addr + '&community=' + community,
        method: 'get'
    })
}

// 左侧面板部分指标免疫详情
export function immunityDetail(pageNum:any, pageSize:any) {
    return request({
        url: '/houseMatch/immunityHouse/?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'get'
    })
}

// 确诊人员分析
export function diagnosePerson(params:any) {
    return request({
        url: '/tbQzrs/getQzryInfo',
        method: 'get',
        params
    })
}

// 隔离人员分析
export function dividePerson(params:any) {
    return request({
        url: '/tbGlry/getGlryInfo',
        method: 'get',
        params
    })
}

// 入境人员分析
export function entryPerson(params:any) {
    return request({
        url: '/tbRjry/getRjryInfo',
        method: 'get',
        params
    })
}

// 疫苗人员分析
export function immunityPerson(params:any) {
    return request({
        url: '/person/get_ymry_list',
        method: 'get',
        params
    })
}

// 来蓉
export function comeRon(params:any) {
    return request({
        url: '/tbZgfx/getList',
        method: 'get',
        params
    })
}

// 楼栋标签
export function buildTag(community:any) {
    return request({
        url: '/person/get_build_tags/' + community,
        method: 'get'
    })
}

// 鼠标移入楼栋详情
export function buildDetail(community:any) {
    return request({
        url: '/person/getBuildInfo/' + community,
        method: 'get'
    })
}




