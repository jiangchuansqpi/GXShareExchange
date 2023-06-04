import { AreaStore } from "@/store/areaDetail";
import Vue from "vue";
import HouseInfoPopup from "@/views/home/component/houseInfo/houseInfoPopup.vue";
import buildInfoPopup from "@/views/home/component/houseInfo/buildInfoPopup.vue";
// import gcoord from 'gcoord'

import { buildDetail, buildTag, getData, zoneDetail } from "@/api";

const city1=require('../assets/geojson/city.json')
const district1=require('../assets/geojson/district.json')
const township1=require('../assets/geojson/township.json')
const neighborhood1=require('../assets/geojson/neighborhood.json')

const icon1 = require('@/assets/img/hm.png')
const icon2 = require('@/assets/img/lj.png')
// const icon3 = require('@/assets/img/jp.png')
const turf = require("@turf/turf");
const aimap = (window as any).aimap;

// @ts-ignore
window.turf = turf
let cName = ''
//社区
let community: any = []
let grid: any = []
let building: any = []
let unit: any = []

//市区
const city:any=city1
//县级
const district:any=district1
//街道
const township:any=township1
//社区
const neighborhood:any=neighborhood1

let buildInfo:any = []
let layer:any
let display:any

const mapDraw = new aimap.Draw({
  displayControlsDefault: true, //所有控件在默认情况下处于关闭状态
  controls: {
    polygon: true, //显示多边形控件
    line_string: false, //不显示标记线控件
    point: false, //不显示标记点控件
    circle: false, //不显示标记圆控件
    rectangle: false, //不显示标记矩形控件
  }
})

export class MapClass {
  static map: any = null
  //市级图层
  static cityLayer:any=null
  //县级图层
  static districtLayer:any=null
  //街道图层
  static townshipLayer:any=null
  //社区图层
  static neighborhoodLayer:any=null
  // 小区图层
  static communityLayer: any = null
  // 网格图层
  static gridLayer: any = null
  //业务实例
  static instance: any = null

  //选中小区网格标注图层
  static selectGridLayer: any = null

  // 楼栋标签点图层
  static tagMarkerLayer: any = null;
  static buildMarkerLayer: any = null;
  // 楼周边的线
  static buildingLineLayer: any = null
  static buildingLineLayer2: any = null
  // 初始化楼栋的面
  static buildingPolygonLayer: any = null
  //初始化白膜  图层底座
  static extrusionLayer: any = null

  // 县级
  static level1: any = null
  //街道级
  static level2: any=null
  //社区级
  static level3: any=null

  // 小区层级
  static level4: any = null
  // 楼栋单元层级
  static level5: any = null
  //楼栋弹出框
  static buildPointPopup: any = null
  // 单元户室层级
  static level6: any = null
   //单元弹出框
  static housePointPopup: any = null

  static buildings: any = [];

  static pointLayer: any = null

  async dataSource() {
    this.initMap()
    cName = AreaStore.communityName
    // const cityRes = await getData("city", cName);
    // city = cityRes.data;

    const comRes = await getData("community", cName);
    community = comRes.data;

    const gridRes = await getData("grid", '月亮湖社区');
    grid = gridRes.data;
    // const buildRes = await getData('building',cName)
    // building = buildRes.data

    const unitRes = await getData("unit", cName);
    unit = unitRes.data;
  }

  // @ts-ignore 初始化地图
  initMap() {
    // const url = 'http://10.1.231.12:5238'
    aimap.accessToken = "On8UDio2zPaEakt7BhKwCFW4h3jGOOMw";
    aimap.baseApiUrl = "https://location-dev.newayz.com";
    // aimap.baseApiUrl = 'http://10.1.231.12:5238/sdk'
    // aimap.srs = 'cgcs2000'

    aimap.Plugin(["threeBox"]);

    MapClass.map = new aimap.Map({
      container: "map",
      // center: [104.03786294248926, 30.55807841695583],
      center: [117.495663, 30.674264],
      minZoom: 8,
      maxZoom: 20,
      zoom: 8,
      pitch: 30,
      bearing: 83,
      antialias: true,
      style: "aimap://styles/aimap/darkblue-v4",
      /*style: {
        "version": 8,
        "sources": {
          "wayz_vector": {
            "type": "vector",
            "tiles": [
              url + "/maps/tilestream/v1/layers/chengdu-admins/tiles/{z}/{x}/{y}"
            ],
            "minzoom": 6,
            "maxzoom": 16,
            "bounds": [102.98944403899998, 30.090995568999972, 104.896373391, 31.437877669999978]
          }
        },
        "sprite": url + "/static/maps/sprites/aimap/dark-v1/sprite",
        "glyphs": url + "/static/maps/fonts/{fontstack}/{range}.pbf",
        "layers": [
          {
            "id": "background",
            "type": "background",
            "metadata": {
              "wayzEditor:comment": "背景",
              "parent": "背景",
              "level": 1
            },
            "layout": {
              "visibility": "visible"
            },
            "paint": {
              "background-color": "#153345"
            }
          },
          {
            "id": "district",
            "type": "fill",
            "metadata": {
              "wayzEditor:comment": "区县、代管市",
              "parent": "无",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "district",
            "minzoom": 6,
            "maxzoom": 9,
            "layout": {
              "visibility": "visible"
            },
            "paint": {
              "fill-color": "#6c7cd8",
              "fill-opacity": 1,
              "fill-outline-color": "white"
            }
          },
          {
            "id": "township",
            "type": "fill",
            "metadata": {
              "wayzEditor:comment": "乡镇",
              "parent": "无",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "township",
            "minzoom": 9,
            "maxzoom": 12,
            "layout": {
              "visibility": "visible"
            },
            "paint": {
              "fill-color": "#213e56",
              "fill-opacity": 1,
              "fill-outline-color": "white"
            }
          },
          {
            "id": "neighborhood",
            "type": "fill",
            "metadata": {
              "wayzEditor:comment": "村居",
              "parent": "无",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "neighborhood",
            "minzoom": 12,
            "layout": {
              "visibility": "visible"
            },
            "paint": {
              "fill-color": "#213e56",
              "fill-outline-color": "white",
              //#829ed8
              // "fill-color": ['match', ['get', '__code__'], '510116001013',  'red', '#213e56'],
              "fill-opacity": 1,
              // "fill-outline-color": ['match', ['get', '__code__'], '510116001013',  '#00ff00', 'white']
            }
          },
          {
            "id": "district_label",
            "type": "symbol",
            "metadata": {
              "wayzEditor:comment": "区县、代管市",
              "parent": "行政标注",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "district_label",
            "minzoom": 6,
            "maxzoom": 9,
            "layout": {
              "text-field": "{__name__}",
              "text-font": [
                "Microsoft YaHei Regular"
              ],
              "icon-image": "50150700",
              "icon-size": 0.7,
              "text-size": 20,
              "text-offset": [
                0,
                0.2
              ],
              "text-anchor": "top",
              "visibility": "visible"
            },
            "paint": {
              "text-color": "white"
            }
          },
          {
            "id": "township_label",
            "type": "symbol",
            "metadata": {
              "wayzEditor:comment": "乡镇",
              "parent": "行政标注",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "township_label",
            "minzoom": 9,
            "maxzoom": 12,
            "layout": {
              "text-field": "{__name__}",
              "text-font": [
                "Microsoft YaHei Regular"
              ],
              "icon-image": "50150700",
              "icon-size": 0.7,
              "text-size": 14,
              "text-offset": [
                0,
                0.2
              ],
              "text-anchor": "top",
              "visibility": "visible"
            },
            "paint": {
              "text-color": "white",
            }
          },
          {
            "id": "neighborhood_label",
            "type": "symbol",
            "metadata": {
              "wayzEditor:comment": "村居",
              "parent": "行政标注",
              "level": 2
            },
            "source": "wayz_vector",
            "source-layer": "neighborhood_label",
            "minzoom": 12,
            "layout": {
              "text-field": "{__name__}",
              "text-font": [
                "Microsoft YaHei Regular"
              ],
              "icon-image": "50150700",
              "icon-size": 0.7,
              "text-size": 14,
              "text-offset": [
                0,
                0.2
              ],
              "text-anchor": "top",
              "visibility": "visible"
            },
            "paint": {
              "text-color": "white",
              // "fill-color": ['match', ['get', '__code__'], '510116001013',  '#213e56', '#213e56'],
            }
          }
        ]
      },*/
      // style: {
      //   "version": 8,
      //   "sources": {
      //     "base_vector": {
      //       "type": "vector",
      //       "tiles": [
      //         "http://172.3.0.98:10101/maps/tilestream/v1/layers/basemap-chengdu/tiles/{z}/{x}/{y}"
      //       ],
      //       "minzoom": 6,
      //       "maxzoom": 18,
      //       "bounds": [
      //         102.98943,
      //         30.090939,
      //         104.896384,
      //         31.379087
      //       ]
      //     }
      //   },
      //   "sprite": "http://172.3.0.98:17041/maps/sprites/aimap/dark-v1/sprite",
      //   "glyphs": "http://172.3.0.98:17041/maps/fonts/{fontstack}/{range}.pbf",
      //   "layers": [
      //     {
      //       "id": "background",
      //       "type": "background",
      //       "metadata": {
      //         "wayzEditor:comment": "背景",
      //         "parent": "背景",
      //         "level": 1
      //       },
      //       "paint": {
      //         "background-color": "#153345"
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "district",
      //       "type": "fill",
      //       "metadata": {
      //         "wayzEditor:comment": "城市",
      //         "parent": "行政面",
      //         "level": 2
      //       },
      //       "minzoom": 6,
      //       "source": "base_vector",
      //       "source-layer": "district",
      //       "paint": {
      //         "fill-color": "#153345",
      //         "fill-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "township",
      //       "type": "fill",
      //       "metadata": {
      //         "wayzEditor:comment": "城市",
      //         "parent": "行政面",
      //         "level": 2
      //       },
      //       "minzoom": 8,
      //       "source": "base_vector",
      //       "source-layer": "district",
      //       "paint": {
      //         "fill-color": "#153345",
      //         "fill-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "neighborhood",
      //       "type": "fill",
      //       "metadata": {
      //         "wayzEditor:comment": "城市",
      //         "parent": "行政面",
      //         "level": 2
      //       },
      //       "minzoom": 10,
      //       "source": "base_vector",
      //       "source-layer": "neighborhood",
      //       "paint": {
      //         "fill-color": "#153345",
      //         "fill-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "water_lake",
      //       "type": "fill",
      //       "metadata": {
      //         "wayzEditor:comment": "湖泊",
      //         "parent": "水系",
      //         "level": 2
      //       },
      //       "minzoom": 7,
      //       "source": "base_vector",
      //       "source-layer": "lake",
      //       "paint": {
      //         "fill-color": "#213E56",
      //         "fill-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "water_river",
      //       "type": "fill",
      //       "metadata": {
      //         "wayzEditor:comment": "河流",
      //         "parent": "水系",
      //         "level": 2
      //       },
      //       "minzoom": 7,
      //       "source": "base_vector",
      //       "source-layer": "river",
      //       "paint": {
      //         "fill-color": "#213E56",
      //         "fill-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "transitline_railway_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "铁路描边",
      //         "parent": "transitline_railway_bg",
      //         "level": 3
      //       },
      //       "minzoom": 6,
      //       "source": "base_vector",
      //       "source-layer": "railway",
      //       "paint": {
      //         "line-color": "#1f7176",
      //         "line-gap-width": {
      //           "stops": [
      //             [
      //               6,
      //               2
      //             ],
      //             [
      //               18,
      //               3
      //             ]
      //           ]
      //         }
      //       }
      //     },
      //     {
      //       "id": "transitline_railway_bg",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "铁路",
      //         "parent": "轨道线路",
      //         "level": 2,
      //         "children": [
      //           "transitline_railway_dasharray",
      //           "transitline_railway_name"
      //         ]
      //       },
      //       "minzoom": 6,
      //       "source": "base_vector",
      //       "source-layer": "railway",
      //       "paint": {
      //         "line-color": "#2e878c",
      //         "line-width": {
      //           "stops": [
      //             [
      //               6,
      //               2
      //             ],
      //             [
      //               18,
      //               3
      //             ]
      //           ]
      //         }
      //       }
      //     },
      //     {
      //       "id": "transitline_railway_dasharray",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "铁路填充",
      //         "parent": "transitline_railway_bg",
      //         "level": 3
      //       },
      //       "minzoom": 6,
      //       "source": "base_vector",
      //       "source-layer": "railway",
      //       "paint": {
      //         "line-color": "#234F58",
      //         "line-width": {
      //           "stops": [
      //             [
      //               6,
      //               2
      //             ],
      //             [
      //               18,
      //               3
      //             ]
      //           ]
      //         },
      //         "line-dasharray": [
      //           3,
      //           3
      //         ]
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_footway_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "步行道路描边",
      //         "parent": "edge_footway",
      //         "level": 3
      //       },
      //       "minzoom": 16,
      //       "filter": [
      //         "==",
      //         "kind",
      //         "footway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#DDDDDD",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               2
      //             ]
      //           ]
      //         },
      //         "line-dasharray": [
      //           2,
      //           3
      //         ]
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_service_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "目的地道路描边",
      //         "parent": "edge_service",
      //         "level": 3
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "service"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#252D32",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               3
      //             ]
      //           ]
      //         },
      //         "line-dasharray": [
      //           2,
      //           3
      //         ]
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_tertiary_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "一般道路描边",
      //         "parent": "edge_tertiary",
      //         "level": 3
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "tertiary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#252D32",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               4
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_secondary_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "次要道路描边",
      //         "parent": "edge_secondary",
      //         "level": 3
      //       },
      //       "minzoom": 14,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "secondary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#193344",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               14,
      //               0.1
      //             ],
      //             [
      //               18,
      //               4
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_primary_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "主要道路描边",
      //         "parent": "edge_primary",
      //         "level": 3
      //       },
      //       "minzoom": 11,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "primary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#193344",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               11,
      //               0.1
      //             ],
      //             [
      //               18,
      //               12
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_provincial_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "省道描边",
      //         "parent": "edge_provincial",
      //         "level": 3
      //       },
      //       "minzoom": 9,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "provincial"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#1D3A4A",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               9,
      //               0.1
      //             ],
      //             [
      //               18,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_national_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "国道描边",
      //         "parent": "edge_national",
      //         "level": 3
      //       },
      //       "minzoom": 7,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "national"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#245D60",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               7,
      //               0.1
      //             ],
      //             [
      //               18,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_footway",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "步行道路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_footway_case",
      //           "edge_footway_name"
      //         ]
      //       },
      //       "minzoom": 16,
      //       "filter": [
      //         "==",
      //         "kind",
      //         "footway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#FFFFFF",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               2
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_service",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "目的地道路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_service_case",
      //           "edge_service_name"
      //         ]
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "service"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#243847",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               3
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_tertiary",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "一般道路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_tertiary_case",
      //           "edge_tertiary_name"
      //         ]
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "tertiary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#193344",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               15,
      //               0.1
      //             ],
      //             [
      //               18,
      //               4
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_secondary",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "次要道路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_secondary_case",
      //           "edge_secondary_name"
      //         ]
      //       },
      //       "minzoom": 14,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "secondary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#193344",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               14,
      //               0.1
      //             ],
      //             [
      //               18,
      //               5
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_primary",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "主要道路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_primary_case",
      //           "edge_primary_name"
      //         ]
      //       },
      //       "minzoom": 11,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "primary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#193344",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               11,
      //               0.1
      //             ],
      //             [
      //               18,
      //               12
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_provincial",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "省道",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_provincial_case",
      //           "edge_provincial_name"
      //         ]
      //       },
      //       "minzoom": 9,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "provincial"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#1D3A4A",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               9,
      //               0.1
      //             ],
      //             [
      //               18,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_national",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "国道",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_national_case",
      //           "edge_national_name"
      //         ]
      //       },
      //       "minzoom": 7,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "national"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#339ba0",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               7,
      //               0.1
      //             ],
      //             [
      //               18,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_motorway_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "高速公路描边",
      //         "parent": "edge_motorway",
      //         "level": 3
      //       },
      //       "minzoom": 6,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "motorway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#16373C",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               6,
      //               0.1
      //             ],
      //             [
      //               17,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_motorway",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "高速公路",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_motorway_case",
      //           "edge_motorway_name"
      //         ]
      //       },
      //       "minzoom": 6,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "motorway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#1fabb2",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               6,
      //               0.1
      //             ],
      //             [
      //               17,
      //               13
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_expressway_case",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "城市环线描边",
      //         "parent": "edge_expressway",
      //         "level": 3
      //       },
      //       "minzoom": 8,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "expressway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#2e878c",
      //         "line-gap-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               7,
      //               0.1
      //             ],
      //             [
      //               17,
      //               12
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_expressway",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "城市环线",
      //         "parent": "道路",
      //         "level": 2,
      //         "children": [
      //           "edge_expressway_case",
      //           "edge_expressway_name"
      //         ]
      //       },
      //       "minzoom": 8,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "expressway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "line-color": "#4da8ad",
      //         "line-opacity": 1,
      //         "line-width": {
      //           "base": 1.5,
      //           "stops": [
      //             [
      //               7,
      //               0.1
      //             ],
      //             [
      //               17,
      //               12
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "line-join": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "transitline_subway_bg",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "地铁设施",
      //         "parent": "轨道线路",
      //         "level": 2,
      //         "children": [
      //           "transitline_subway_name"
      //         ]
      //       },
      //       "minzoom": 8,
      //       "source": "base_vector",
      //       "source-layer": "subway",
      //       "paint": {
      //         "line-color": "#BED9A4",
      //         "line-blur": 1,
      //         "line-width": {
      //           "base": 1,
      //           "stops": [
      //             [
      //               11,
      //               1.5
      //             ],
      //             [
      //               18,
      //               4
      //             ]
      //           ]
      //         }
      //       },
      //       "layout": {
      //         "line-cap": "round",
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "transitline_subway_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "地铁名称",
      //         "parent": "transitline_subway_bg",
      //         "level": 3
      //       },
      //       "minzoom": 10,
      //       "source": "base_vector",
      //       "source-layer": "subway",
      //       "paint": {
      //         "text-color": "#4A5357"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "transitline_railway_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "铁路名称",
      //         "parent": "transitline_railway_bg",
      //         "level": 3
      //       },
      //       "minzoom": 10,
      //       "source": "base_vector",
      //       "source-layer": "railway",
      //       "paint": {
      //         "text-color": "#6F777A"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_footway_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "步行道路名称",
      //         "parent": "edge_footway",
      //         "level": 3
      //       },
      //       "minzoom": 16,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "footway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#90816F"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_service_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "出入目的地道路名称",
      //         "parent": "edge_service",
      //         "level": 3
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "service"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#90816F"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_tertiary_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "一般道路名称",
      //         "parent": "edge_tertiary",
      //         "level": 3
      //       },
      //       "minzoom": 15,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "tertiary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#90816F"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_secondary_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "次要道路名称",
      //         "parent": "edge_secondary",
      //         "level": 3
      //       },
      //       "minzoom": 14,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "secondary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#90816F"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_primary_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "主要道路名称",
      //         "parent": "edge_primary",
      //         "level": 3
      //       },
      //       "minzoom": 11,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "primary"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#90816F"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_provincial_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "省道名称",
      //         "parent": "edge_provincial",
      //         "level": 3
      //       },
      //       "minzoom": 9,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "provincial"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#876D18"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_national_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "国道名称",
      //         "parent": "edge_national",
      //         "level": 3
      //       },
      //       "minzoom": 7,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "national"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#7F4B24"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_motorway_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "高速公路名称",
      //         "parent": "edge_motorway",
      //         "level": 3
      //       },
      //       "minzoom": 12,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "motorway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#6D410B"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "edge_expressway_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "城市环线名称",
      //         "parent": "edge_expressway",
      //         "level": 3
      //       },
      //       "minzoom": 8,
      //       "filter": [
      //         "==",
      //         "rank",
      //         "expressway"
      //       ],
      //       "source": "base_vector",
      //       "source-layer": "edge",
      //       "paint": {
      //         "text-color": "#6D410B"
      //       },
      //       "layout": {
      //         "text-field": "{name}",
      //         "symbol-placement": "line",
      //         "symbol-spacing": 250,
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 9,
      //         "visibility": "visible"
      //       }
      //     },
      //     {
      //       "id": "admin_district_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "区县",
      //         "parent": "行政标注",
      //         "level": 2
      //       },
      //       "minzoom": 6,
      //       "maxzoom": 11,
      //       "source": "base_vector",
      //       "source-layer": "district_label",
      //       "layout": {
      //         "text-field": "{name}",
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "icon-image": "50150700",
      //         "icon-size": 0.7,
      //         "text-size": 14,
      //         "text-offset": [
      //           0,
      //           0.2
      //         ],
      //         "text-anchor": "top",
      //         "visibility": "visible"
      //       },
      //       "paint": {
      //         "text-color": "#4FA4A1"
      //       }
      //     },
      //     {
      //       "id": "admin_township_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "街镇",
      //         "parent": "行政标注",
      //         "level": 2
      //       },
      //       "minzoom": 11,
      //       "maxzoom": 13,
      //       "source": "base_vector",
      //       "source-layer": "township_label",
      //       "layout": {
      //         "text-field": "{name}",
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 13,
      //         "text-offset": [
      //           0,
      //           0
      //         ],
      //         "text-anchor": "top",
      //         "visibility": "visible"
      //       },
      //       "paint": {
      //         "text-color": "#4FA4A1"
      //       }
      //     },
      //     {
      //       "id": "admin_neighborhood_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "村居",
      //         "parent": "行政标注",
      //         "level": 2
      //       },
      //       "minzoom": 13,
      //       "maxzoom": 15,
      //       "source": "base_vector",
      //       "source-layer": "neighborhood_label",
      //       "layout": {
      //         "text-field": "{name}",
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "text-size": 12,
      //         "text-offset": [
      //           0,
      //           0
      //         ],
      //         "text-anchor": "top",
      //         "visibility": "visible"
      //       },
      //       "paint": {
      //         "text-color": "#4FA4A1"
      //       }
      //     },
      //     {
      //       "id": "entity_subway_station_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "公共设施",
      //         "parent": "兴趣点",
      //         "level": 2
      //       },
      //       "minzoom": 13,
      //       "source": "base_vector",
      //       "source-layer": "subway_station",
      //       "layout": {
      //         "text-field": "{name}",
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "icon-image": "50150700",
      //         "icon-size": 0.7,
      //         "text-size": 11,
      //         "text-offset": [
      //           0,
      //           0.2
      //         ],
      //         "text-anchor": "top",
      //         "visibility": "visible"
      //       },
      //       "paint": {
      //         "text-color": "#4D4E51"
      //       }
      //     },
      //     {
      //       "id": "entity_subway_entrance_name",
      //       "type": "symbol",
      //       "metadata": {
      //         "wayzEditor:comment": "公共设施",
      //         "parent": "兴趣点",
      //         "level": 2
      //       },
      //       "minzoom": 14,
      //       "source": "base_vector",
      //       "source-layer": "subway_entrance",
      //       "layout": {
      //         "text-field": "{name}",
      //         "text-font": [
      //           "Microsoft YaHei Regular"
      //         ],
      //         "icon-image": "50150700",
      //         "icon-size": 0.7,
      //         "text-size": 11,
      //         "text-offset": [
      //           0,
      //           0.2
      //         ],
      //         "text-anchor": "top",
      //         "visibility": "visible"
      //       },
      //       "paint": {
      //         "text-color": "#4D4E51"
      //       }
      //     },
      //     {
      //       "id": "district-boundary",
      //       "type": "line",
      //       "metadata": {
      //         "wayzEditor:comment": "省份",
      //         "parent": "行政面",
      //         "level": 2
      //       },
      //       "minzoom": 6,
      //       "source": "base_vector",
      //       "source-layer": "district",
      //       "paint": {
      //         "line-color": "white",
      //         "line-opacity": 1
      //       },
      //       "layout": {
      //         "visibility": "visible"
      //       }
      //     }
      //   ]
      // },
      localIdeographFontFamily: "'Microsoft YaHei'"
    })
    this.loadMapEvent()
  }

  loadMapEvent() {
    // 事件
    this.addEvent();
    // 添加地图控件
    this.addControl();
    // 地图加载完成
    this.mapLoaded();
  }

  addEvent(): void {}

  // 添加控件
  addControl(): void {
    MapClass.map.addControl(new aimap.CompassControl());
    MapClass.map.addControl(
      new aimap.ScaleControl(
        {
          maxWidth: 80,
          unit: "metric",
        },
        {
          left: 20,
          top: 0,
        }
      )
    );
    MapClass.map.addControl(mapDraw);
    const ele = document.getElementsByClassName("aimap-draw_trash");
    ele[0].setAttribute("title", "删除面");
  }

  // 初始化蒙版
  initOverlyLayer(): void {
    // 创建蒙版，覆盖村居范围以外的区域
    const outlinePolygon = turf.buffer({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        //coordinates: [
        //   [
        //     [115, 28],
        //     [125, 28],
        //     [125, 35],
        //     [115, 35],
        //     [115, 28]
        //   ]
        // ].concat(community.features[0].geometry.coordinates.map((c: any) => c[0])) //加了后面的这句话就报错
        coordinates: [
          [
            [115, 28],
            [125, 28],
            [125, 35],
            [115, 35],
            [115, 28]
          ]
        ]
      }
    }, -0.15) // 单位：千米

    console.log("outlinePolygon", outlinePolygon);
    /*const neighborhoodOutOverlayLayer = new aimap.Polygon({
      id: 'neighborhoodOutOverlayLayer',
      map: MapClass.map,
      data: outlinePolygon,
      style: {
        'fill-color': '#153345'
      }
    })*/

    // 创建蒙版的模糊边界线
    /*const overlayOutlineLayer = new aimap.LineString({
      map: MapClass.map,
      data: outlinePolygon,
      style: {
        'line-color': '#153345',
        'line-blur': ['interpolate', ['linear'],
          ['zoom'], 14, 20, 20, 100
        ],
        'line-width': ['interpolate', ['linear'],
          ['zoom'], 14, 40, 20, 200
        ]
      }
    })*/
  }

  //地图图层事件
  mapLoaded(): void {
    MapClass.map.on('load', () => {
      // 初始化蒙版
      this.initOverlyLayer()
      //初始化县级图层
      this.initDistrictLayer()
      // 网格区域
      // this.initGridLayer()
      // this.initLevel1()

      getData('building', '月亮湖社区').then(res => {
        if (!res.code) {
          building = res.data;
          // 楼栋的面 用于点击楼栋事件触发
          this.buildingPolygon();
          // 白膜加载
          this.initBuildingLayer();
          // 初始化小区级别
          // console.log(MapClass.level1,'MapClass.level12222222~~~');
          this.initLevel1()
        }
      });

      // 楼层线
      // this.initBuildingLine()
      // 在单元里边撒点
      // this.inUnitPointLayer()

      // @ts-ignore
      (document.getElementsByClassName(
        "aimap-ctrl"
      )[0] as any).style.cssText = `background:transparent`;
      // @ts-ignore
      (document.getElementsByClassName(
        "aimap-draw_polygon"
      )[0] as any).style.cssText = `background-image: url(${icon1})`;
      // @ts-ignore
      (document.getElementsByClassName(
        "aimap-draw_trash"
      )[0] as any).style.cssText = `background-image: url(${icon2})`;
      // @ts-ignore
      // document.getElementsByClassName('aimap-draw_line')[0].style.cssText = `background-image: url(${icon3})`
    });

    // 地图绘制完成事件
    MapClass.map.on('draw.create', (event: any) => {
      // 之所以要把绘制出来的 polygon 从 wgs84 坐标转换成 gcj02，是因为提供的数据是 gcj02 的，用的底图却是 cgcs2000 的。
      // cgcs2000 一般情况下可以等同于 wgs84
      // cgcs2000 的底图，画出来的 polygon 的坐标就是 cgcs2000 的。
      // 计算 booleanPointInPolygon 时，两个参数要在同一坐标系下，才能计算。
      /*const constPolygon = gcoord.transform(
        event.features[0],
        gcoord.WGS84,
        gcoord.GCJ02
      )

      // 向禛这里写的 dfs 没搞懂要做什么，是要把一个几何形状里面的所有 point 取出来？为啥？
      building.features.filter((f:any) => {
        // @ts-ignore
        return turf.booleanPointInPolygon(turf.center(f), constPolygon)
      });*/

      const includedPoly = building.features.filter((feature: any) => turf.booleanIntersects(event.features[0], feature));//判断是否相交
      // console.log('包含的面数据：', includedPoly);

      MapClass.buildings = [];
      for (const ele of includedPoly) {
        const building = ele.properties.building;
        MapClass.buildings.push(building);
        // @ts-ignore
      }
      this.pointIn(event.features[0].geometry.coordinates);
    });

    MapClass.map.on("draw.modechange", function (event: any) {
      if (
        mapDraw.getAll().features.length > 1 &&
        event.mode !== "simple_select"
      ) {
        mapDraw.delete(mapDraw.getAll().features[0].id);
      }
    });
    MapClass.map.on("draw.delete", function (event: any) {
      console.log("del", event);
      MapClass.pointLayer.layer.remove();
    });
  }

  //设置楼栋光墙的颜色
  setWallColor(){
    const {
      grid
    }:any = AreaStore.grid

    const features: Array<any> = [];
    const data = {
      type: "FeatureCollection",
      features,
    };

    building.features.forEach((item: any) => {
      const f: any = item;
      if (f.properties.grid === grid) data.features.push(f);
    });
    const com = AreaStore.communityName
    //楼栋标签
    buildTag(com).then(res => {
      const result = res.data
      for (const re of result) {
        const red = re.isQz;
        const yellow =
          re.isMj ||
          re.isCmj ||
          re.isZygl ||
          re.isDqjjgl ||
          re.isHightRisk ||
          re.isRj;

        data.features.map((f: any) => {
          if (f.properties.building_id === re.buildingId) {
            if (red) {
              f.properties.wallColorVal = "红";
              return;
            }
            if (yellow) {
              f.properties.wallColorVal = "黄";
            }
          }
        });
      }
      this.initWall(data);
    });
  }

  //初始化光墙
  initWall(wd:any){
    layer = new aimap.RippleWall({
      mode: "3d",
      map: MapClass.map,
      // spatialReference: 'wgs84',
      data: turf.buffer(wd, 0.0005),//turf.buffer为给定半径的Feature计算一个缓冲区
      style: {
        // 用数据里面的 altitude 作为光墙的高度
        "wall-height": ["get", "altitude"],
        // 下面这个表达式是一个示例，意思是：根据数据里面的 building 字段来给颜色，如果是'6栋'，就是'#FF0000'色；如果是'7栋'，就是'#00FF00'色，其余的为 '#0099FF' 色。
        "wall-color": [
          "match",
          ["get", "wallColorVal"],
          "红",
          "red",
          "黄",
          "yellow",
          "#0099FF",
        ],
        "wall-base": 0,
        "wall-opacity": 1,
      },
    })
    this.animate()//按帧对网页进行重绘
    this.mapOn()
  }
  //判断是否返回原始地图层级的事件
  mapOn(){
    MapClass.map.on('zoom', ()=>{
      if (MapClass.map.getZoom() > 14) {
        if (!display) {
          layer.show();
          display = true;
        }
      } else {
        layer.hide();
        display = false;
      }
    });
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this))//按帧对网页进行重绘
  }

  // 初始化白膜
  initBuildingLayer(): void {
    MapClass.extrusionLayer = new ExtrusionLayer({
      data: building,
      // spatialReference: 'gcj02',
      style: {
        "extrusion-color": "#3E4E5B",
        "extrusion-base": 0,
        "extrusion-height": ["get", "altitude"],
        "extrusion-opacity": 0.6,
      },
    });
    /*this.extrusionFitView({
      padding: {
        top: 300,
        bottom: 300,
        left: 300,
        right: 300
      }
    })*/
  }
  //使地图带有动画的跳转，使得图层的数据铺满屏幕
  extrusionFitView(config?: any) {
    MapClass.extrusionLayer.layer.fitView(config);
  }
  //初始化市级图层
  // initCityLayer(): void {
  //   console.log('city',city);
  //   MapClass.cityLayer = new PolygonLayer({
  //     zoom:16,
  //     data: city,
  //     // spatialReference: 'cgcs2000',
  //     style: {
  //       'fill-opacity': 0,
  //       'line-color': '#fff',
  //       'line-width': 3,
  //     },
  //     highlight: {
  //       style: {
  //         'line-color': 'red',
  //         'line-width': 3,
  //         'visibility': 'none'
  //       }
  //     }
  //   })
  //   console.log('cityLayer', MapClass.cityLayer)
  //   //使地图带有动画的跳转，使得图层的数据铺满屏幕。
  //   MapClass.cityLayer.layer.fitView({
  //     // filter: ['==', 'grid_id', gridId],
  //     padding: {
  //       left: 200,
  //       right: 200,
  //       top: 200,
  //       bottom: 100
  //     }
  //   })
  // }
  //初始化城市图层
  initCityLayer() {
    MapClass.cityLayer = new PolygonLayer({
      zoom: 14,
      data: city,
      // spatialReference: 'wgs84',
      style: {
        "fill-opacity": 0,
        "line-color": "#00FF00",
        "line-width": 2,
      },
    });
    console.log("cityLayer", MapClass.cityLayer);
    MapClass.cityLayer.layer.fitView({
      // filter: ['==', 'grid_id', gridId],
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100,
      },
    });
  }

  //初始化县级图层
  initDistrictLayer(): void {
    MapClass.districtLayer = new PolygonLayer({
      data: district,
      // spatialReference: 'gcj02',
      style: {
        'fill-opacity': 0,
        'line-color': '#FFFFFF',
        'line-width': 2,
        'text-field': '{district}',
        'text-color': '#FFF'
      },
      highlight: {
        style: {
          'line-color': 'yellow',
          'line-width': 3,
          'visibility': 'none'
        }
      }
    })
    MapClass.districtLayer.layer.fitView({
      // filter: ['==', 'grid_id', gridId],
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100
      }
    })
    //给县图层添加事件
    this.districtEvent()
  }
  //给县图层添加事件
  districtEvent(){
    MapClass.districtLayer.layer.on('mousemove', (e: any): void => {
      MapClass.districtLayer.layer.highlight({
        filter: ['==', 'district', e!.features[0]!.properties.district],
        changeCamera: false
      })
    })
    MapClass.districtLayer.layer.on('mouseleave', (): void => {
      MapClass.districtLayer.layer.clearHighlight()
    })
    MapClass.districtLayer.layer.on('click', (e: any) => {
      console.log('7777777',e);
    })
  }

  // 初始化网格区域
  // initGridLayer(): void {
  //   MapClass.gridLayer = new PolygonLayer({
  //     data: grid,
  //     // spatialReference: 'wgs84',
  //     style: {
  //       "fill-opacity": 0,
  //       "line-color": "green",
  //     },
  //     highlight: {
  //       style: {
  //         "line-color": "red",
  //         "line-width": 2,
  //         visibility: "none",
  //       },
  //     },
  //   });
  //   MapClass.gridLayer.layer.on("mousemove", (e: any) => {
  //     MapClass.gridLayer.setHighlight({
  //       filter: ['==', 'grid_id', e!.features[0]!.properties.grid_id],
  //       changeCamera: false
  //     })
  //   })
  //   MapClass.gridLayer.layer.on('mouseleave', () => {
  //     MapClass.gridLayer.layer.clearHighlight()
  //   })
  //   MapClass.gridLayer.layer.on('click', (e: any) => {
  //     console.log('e--------',e)
  //     // if (AreaStore.level === 1) {
  //     // MapClass.level4.changeToLevel(e!.features[0]!.properties.grid_id)
  //     // 清除level6图层
  //     MapClass.level6 && MapClass.level6.clear()
  //     // }
  //   });
  // }

  // 显示选中小区（网格）的标注
  showSelectGrid(data: any) {
    console.log('data11111',data);

    // MapClass.selectGridLayer ? MapClass.selectGridLayer.remove() : ''
    MapClass.selectGridLayer = new aimap.Polygon({
      data: [data],
      style: {
        "fill-color": "",
        "fill-opacity": 0.7,
        "line-color": "green",
        "line-width": 2,
        "text-field": "{name}",
        "text-color": "white",
        "text-size": 16,
      },
    });

    MapClass.selectGridLayer.addTo(MapClass.map);
    MapClass.selectGridLayer.fitView(MapClass.map)
  }

  // 初始化楼栋的面
  buildingPolygon(): void {
    MapClass.buildingPolygonLayer = new PolygonLayer({
      mode: "3d",
      /**
       * ！！！！！
       * 所有 3d 的图层中传入的数据，我都深拷贝了一下，
       * 是 sdk 做的不好，不应该把传入的数据给改掉
       * 所以现在不会有数据的坐标被加上一个 0 的情况了。
       * ！！！！！
       */
      data: JSON.parse(JSON.stringify(building)),
      style: {
        "fill-opacity": 0.01,
        "line-color": "red",
        height: ["get", "altitude"],
      },
    });
    MapClass.buildingPolygonLayer.layer.on("click", (e: any) => {
      console.log("e", e);
    });
  }

  matchBuildLine(build: any) {
    MapClass.buildingLineLayer2 && MapClass.buildingLineLayer2.layer.remove();
    const features: Array<any> = [];
    const data = {
      type: "FeatureCollection",
      features,
    };
    const line: any = build;
    data.features.push(...turf.polygonToLine(line)?.features);
    console.log('data777',data);

    MapClass.buildingLineLayer2 = new LineLayer({
      mode: "3d",
      data: JSON.parse(JSON.stringify(data)),
      // spatialReference: 'wgs84',
      // spatialReference: 'gcj02',
      style: {
        "line-color": "red",
        // "line-color": ['match', ['get', '__code__'], '510116001013',  'red', 'blue'],
        "line-width": 1.5,
        height: ["+", ["get", "altitude"], 0.25],
      },
    });
  }

  //鼠标事件移入到楼栋的
  mouseEvent(){
    buildDetail(`${AreaStore.communityName}`).then(res=>{
      buildInfo = res.data
    })
    const {
      grid
    }:any = AreaStore.grid
    MapClass.buildingLineLayer.layer.on('mouseover', (e: any) => {
      if (e.features[0].properties.grid === grid && AreaStore.curNav !== 'community'){
        MapClass.buildingLineLayer2 && MapClass.buildingLineLayer2.layer.remove()
        this.mouseoverPoint(e)
      }
    })
    MapClass.buildingLineLayer.layer.on('mouseout', ()=>{
      MapClass.buildPointPopup.remove()
    })
  }

  mouseoverPoint(e:any){
    const {
      building_id, grid
    } = e.features[0].properties
    const buildPloy = building.features.find((f:any)=>{
      return f.properties.grid === grid && f.properties.building_id === building_id
    })
    const center = this.calcCp(buildPloy.geometry.coordinates[0])
    MapClass.buildMarkerLayer = new aimap.MassMarkerLayer({
      mode: '3d',
      data: [{
        coordinates: center.geometry.coordinates,
        count: 207,
        id: 1,
        name: '点'
      }],
      // spatialReference: 'wgs84',
      style: {
        'text-field': '',
        'text-color': '#e3e3ff',
        'text-size': 5,
        'circle-color': '#cc8ce8',
        'circle-radius': 10,
        'circle-stroke-color': '#ffff00',
        'circle-stroke-opacity': 0.5,
        'circle-stroke-width': 1,
        height: ['get', 'altitude'],
      }
    });
    MapClass.buildingLineLayer.layer.on("mouseout", () => {
      MapClass.buildPointPopup.remove();
      console.log(988);
    });
    MapClass.buildMarkerLayer.addTo(MapClass.map)
    this.buildPopup(center, {building_id, grid})
  }
  //楼栋弹出框
  buildPopup(e: any, buildAttr:any) {
    const matchData = buildInfo.find((d:any)=>{
      return d.buildingId === buildAttr.building_id && d.residentialName === buildAttr.grid
    })
    const popupHtml = `
            <div id="point-popup2">
            </div>
        `;
    MapClass.buildPointPopup = new aimap.Popup({
      closeButton: false,
      maxWidth: "1000px",
      anchor: "bottom",
      offset: [-10, -15],
    })
      .setHTML(popupHtml)
      .setLngLat(e.geometry.coordinates, 5)
      .addTo(MapClass.map);

    const IconInfoCtor = Vue.extend(buildInfoPopup);
    new IconInfoCtor({
      propsData: {
        detail: matchData,
      },
    }).$mount("#point-popup2");
  }

  //渲染楼的标签
  renderBuildTag() {
    const com = AreaStore.communityName;
    buildTag(com).then((res) => {
      const result = res.data;
      const pointList = [];
      for (const re of result) {
        const red = re.Qz || re.isMj || re.isCmj;
        const yellow = re.isZygl || re.isHightRisk || re.isRj || re.isDqjjgl;
        const cdi = re.coordinates.coordinates[0];

        // 计算边界
        const line = turf.lineString(cdi[0]);
        const bbox = turf.bbox(line);
        const bboxPolygon = turf.bboxPolygon(bbox);

        // 计算两个随机点
        const points = turf.randomPoint(2, { bbox: bboxPolygon.bbox });
        const p1 = points.features[0].geometry.coordinates;
        const p2 = points.features[1].geometry.coordinates;

        if (red) {
          pointList.push({
            type: "red",
            poi: p1,
          });
        }
        if (yellow) {
          pointList.push({
            type: "yellow",
            poi: p2,
          });
        }
      }
      if (pointList.length > 0) {
        /*const data = pointList.map(p => {
          const point = {
            name: p.type,
            icon: p.type,
            coordinates: p.poi
          }
          return point
        })*/
        // this.renderTagLayer(data)
      }
    });
  }

  // 标签撒点图层
  renderTagLayer(data: any) {
    MapClass.tagMarkerLayer = new aimap.MassMarkerLayer({
      mode: "3d",
      data: JSON.parse(JSON.stringify(data)),
      images: [{
        id: 'red',
        type: 'png',
        url: require('@/assets/img/red.png')
      }, {
        id: 'yellow',
        type: 'png',
        url: require('@/assets/img/yellow.png')

      }],
      // spatialReference: 'wgs84',
      style: {
        'text-field': '',
        'text-color': 'red',
        'text-anchor': 'bottom',
        // 'text-offset': [0, 1],
        'icon-anchor': 'bottom',
        'icon-image': ['get', 'icon'],//获取data中的icon属性值来配置图标
        'icon-size': 0.8,//这个数字表示对输入的图片的缩放比例
        height: ['+', ['get', 'altitude'], 4]
      },
    });
    MapClass.tagMarkerLayer.addTo(MapClass.map);
  }

  // 计算面的中心点
  calcCp(zone: Array<any>[]) {
    // const polygon = turf.polygon(zone);
    // const center = turf.centerOfMass(polygon);

    const turfP: any = [];
    zone[0].map((z: any) => {
      turfP.push(turf.point(z));
    });
    const features = turf.featureCollection(turfP);
    return turf.center(features);
  }

  pointIn(zone: Array<any>[]) {
    const center = this.calcCp(zone);
    MapClass.pointLayer = new PointLayerFor3D({
      data: [
        {
          count: 207,
          id: 1,
          name: "点",
          coordinates: center.geometry.coordinates,
        },
      ],
      // spatialReference: 'wgs84',
      images: [
        {
          id: "people",
          type: "png",
          url: require("@/assets/img/peopleIcon.png"),
        },
      ],
      style: {
        "circle-radius": 5,
        "circle-color": "red",
        "circle-opacity": 0,
        height: ["get", "buidingHeight"],
        "icon-image": "people", // 获取data中的icon属性值来配置图标
        "icon-size": ["interpolate", ["linear"], ["zoom"], 12, 0.1, 17, 0.5],
      },
    });

    MapClass.pointLayer.layer.on("click", (e: any) => {
      this.popup(e).then((r: any) => {
        console.log(r);
      });
    });
  }

  async popup(e: any) {
    const buildings = MapClass.buildings;
    const data = await zoneDetail(`${AreaStore.communityName}`, buildings);

    const popupHtml = `
            <div id="point-popup">
            </div>
        `;
    // console.log('e', e)
    MapClass.housePointPopup = new aimap.Popup({
      maxWidth: "1000px",
      anchor: "center",
    })
      .setHTML(popupHtml)
      .setLngLat(e.features[0].geometry.coordinates, 5)
      .addTo(MapClass.map);

    const IconInfoCtor = Vue.extend(HouseInfoPopup);
    new IconInfoCtor({
      propsData: {
        detail: data.data,
      },
    }).$mount("#point-popup");
  }

  // 楼层线[已注释调用]
  initBuildingLine(): void {
    const features: any[] = [];
    const unitData = {
      type: "FeatureCollection",
      features,
    };
    unit.features.forEach((item: any) => {
      for (let i = 1; i < Number(item.properties.floors); i++) {
        const data = turf.polygonToLine(item);
        const buildingHeight = item.properties.height * i;
        data.features.forEach((line: any) => {
          const copyLine = JSON.parse(JSON.stringify(line));
          copyLine.properties.buidingHeight = buildingHeight;
          unitData.features.push(copyLine);
        });
      }
    });
  }

  initLevel1(): any {
    console.log(MapClass.level1,'MapClass.level12222222~~~');
    MapClass.level1 = new Level1()
    MapClass.level1.init()
  }
}

class ExtrusionLayer {
  layer: any = null;

  constructor(data: any) {
    this.init(data);
  }

  init(data: any): void {
    this.layer = new aimap.Extrusion({
      map: MapClass.map,
      zIndex: 2,
      ...data,
    });
  }

  fitView(config?: any): void {
    console.log("config!!!!!!!", config);
    this.layer.fitView(config);
  }
}

class PolygonLayer {
  layer: any = null;

  constructor(data: any) {
    this.init(data);
  }

  init(data: any): void {
    this.layer = new aimap.Polygon({
      map: MapClass.map,
      ...data,
    });
  }

  setHighlight(config: any): void {
    this.layer.highlight(config);
  }
}

class MassMarkerLayer {
  layer: any = null;

  constructor(data: any) {
    this.init(data);
  }

  init(data: any): void {
    this.layer = new aimap.MassMarkerLayer({
      map: MapClass.map,
      maxZoom: 22,
      ...data,
    });
  }
}

export class LineLayer {
  layer: any = null;

  constructor(data: any) {
    this.init(data);
  }

  init(data: any): void {
    this.layer = new aimap.LineString({
      map: MapClass.map,
      maxZoom: 22,
      ...data,
    });
  }
}

export class PointLayerFor3D {
  layer: any = null;

  constructor(data: any) {
    this.init(data);
  }

  init(data: any): void {
    this.layer = new aimap.MassMarkerLayer({
      mode: "3d",
      map: MapClass.map,
      ...data,
    });
  }
}

//县级
class Level1{
  // 文字图层
  massLayer: any = null
  init():void{
    MapClass.districtLayer.layer.show()
    MapClass.districtLayer.layer.fitView({
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100
      }
    })
  }
  //从县到街道
  changeToLevel(districtId: string): void {
    //隐藏县图层
    MapClass.districtLayer && MapClass.districtLayer.layer.hide()
    MapClass.level2 = new Level2()
    MapClass.level2.init()
    MapClass.districtLayer.layer.fitView({
      filter: ['==', 'district_id', districtId],
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100
      }
    })
    MapClass.districtLayer.setHighlight({
      filter: ['==', 'district_id', districtId],
      changeCamera: false
    })
    AreaStore.updateLevel(2)
    AreaStore.updateGridId(district)
  }

  clear(): void {
    MapClass.districtLayer.layer.flyTo()
    MapClass.districtLayer.layer.clearHighlight()
    MapClass.townshipLayer.layer.fitView({
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100
      }
    })
    MapClass.townshipLayer.layer.hide()
    MapClass.districtLayer.layer.fitView()
  }
}
//街道级
class Level2{
  massLayer: any = null

  //从街道到社区
  changeToLevel(townshipId: string): void {
    //隐藏街道图层
    MapClass.townshipLayer && MapClass.townshipLayer.layer.hide()
    MapClass.level3 = new Level3()
    MapClass.level3.init()
    MapClass.townshipLayer.layer.fitView({
      filter: ['==', 'township_id', townshipId],
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100
      }
    })
    MapClass.townshipLayer.setHighlight({
      filter: ['==', 'township_id', townshipId],
      changeCamera: false
    })
    AreaStore.updateLevel(3)
    AreaStore.updateGridId(township)
  }

  init():void{
    this.initTownshipLayer()
  }
  //初始化街道图层
  initTownshipLayer(): void {
    const townshipData = township.features.filter((f:any)=>{
     return f.properties.district_id === AreaStore.districtId
    })
    MapClass.townshipLayer = new PolygonLayer({
      data:townshipData,
      // spatialReference: 'gcj02',
      style: {
        'fill-opacity': 0,
        'line-color': '#FFF',
        'line-width': 2,
        'text-field': '{township}',
        'text-color': '#FFF'
      },
      highlight: {
        style: {
          'line-color': 'yellow',
          'line-width': 3,
          'visibility': 'none'
        }
      }
    })
    MapClass.townshipLayer.layer.fitView({
      // filter: ['==', 'grid_id', gridId],
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100
      }
    })
    //给街道层添加事件
    this.townshipEvent()
  }
  //给街道层添加事件
  townshipEvent(){
    MapClass.townshipLayer.layer.on('mousemove', (e: any): void => {
      MapClass.townshipLayer.layer.highlight({
        filter: ['==', 'township', e!.features[0]!.properties.township],
        changeCamera: false
      })
    })
    MapClass.townshipLayer.layer.on('mouseleave', (): void => {
      MapClass.townshipLayer.layer.clearHighlight()
    })
    MapClass.townshipLayer.layer.on('click', (e: any) => {
      console.log('7777777',e);
    })
  }

  clear(): void {
    console.log('清除社区');
    MapClass.neighborhoodLayer.layer.hide()
    console.log('清除网格');
    console.log('MapClass.gridLayer--------------------',MapClass.gridLayer);
    MapClass.gridLayer && MapClass.gridLayer.layer.hide()
    console.log('清除小区');
    MapClass.buildingLineLayer.layer.hide()
    console.log('清除线');
    MapClass.townshipLayer.layer.flyTo()
    MapClass.townshipLayer.layer.clearHighlight()
    // MapClass.neighborhoodLayer.layer.fitView({
    //   padding: {
    //     left: 200,
    //     right: 200,
    //     top: 200,
    //     bottom: 100
    //   }
    // })
    MapClass.townshipLayer.layer.fitView()
  }

}
//社区级
class Level3{
  // 文字图层
  massLayer: any = null;

  //从社区到小区
  changeToLevel(neighborhoodId: string): void {
    MapClass.level4 = new Level4()
    MapClass.level4.init()
    MapClass.neighborhoodLayer.layer.fitView({
      filter: ['==', 'neighborhood_id', neighborhoodId],
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100
      }
    })
    MapClass.neighborhoodLayer.setHighlight({
      filter: ['==', 'neighborhood_id', neighborhoodId],
      changeCamera: false
    })
    AreaStore.updateLevel(4)
    AreaStore.updateGridId(neighborhood)
  }

  init(): void {
    this.initNeighborhoodLayer()
    // this.initCommunityLayer()
    this.buildingLine()
  }
  //初始化社区图层
  initNeighborhoodLayer():void{
    const neighborhoodData=neighborhood.features.filter((f:any)=>{
      return f.properties.township_id === AreaStore.townshipId
     })
    MapClass.neighborhoodLayer = new PolygonLayer({
      zoom:16,
      data: neighborhoodData,
      // spatialReference: 'gcj02',
      style: {
        'fill-opacity': 0,
        'line-color': '#FFF',
        'line-width': 3,
        'text-field': '{neighborhood}',
        'text-color': '#FFF'
      },
      highlight: {
        style: {
          'line-color': 'yellow',
          'line-width': 3,
          'visibility': 'none'
        }
      }
    })
    MapClass.neighborhoodLayer.layer.fitView({
      // filter: ['==', 'grid_id', gridId],
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100
      }
    })
    //给社区层添加事件
    this.neighborhoodEvent()
  }
  //给社区层添加事件
  neighborhoodEvent(){
    MapClass.neighborhoodLayer.layer.on('mousemove', (e: any): void => {
      MapClass.neighborhoodLayer.layer.highlight({
        filter: ['==', 'neighborhood', e!.features[0]!.properties.neighborhood],
        changeCamera: false
      })
    })
    MapClass.neighborhoodLayer.layer.on('mouseleave', (): void => {
      MapClass.neighborhoodLayer.layer.clearHighlight()
    })
    MapClass.neighborhoodLayer.layer.on('click', (e: any) => {
      console.log('7777777',e);
    })
  }

  // 初始化小区图层
  initCommunityLayer() {
    MapClass.communityLayer = new PolygonLayer({
      zoom: 14,
      data: community,
      // spatialReference: 'wgs84',
      style: {
        "fill-opacity": 0,
        "line-color": "#00FF00",
        "line-width": 2,
      },
    });
    console.log("communityLayer", MapClass.communityLayer);
    MapClass.communityLayer.layer.fitView({
      // filter: ['==', 'grid_id', gridId],
      padding: {
        left: 200,
        right: 200,
        top: 200,
        bottom: 100,
      },
    });
  }

  buildingLine(): void {
    const features: Array<any> = [];
    const data = {
      type: 'FeatureCollection',
      features
    }
    console.log(building,'building~~~~~');
    
    building.features.forEach((item: any) => {
      const line: any = (item)
      data.features.push(...turf.polygonToLine(line)?.features)
    })
    MapClass.buildingLineLayer = new LineLayer({
      mode: "3d",
      data: JSON.parse(JSON.stringify(data)),
      // spatialReference: 'wgs84',
      style: {
        "line-color": "#29B2BF",
        // 'line-color': 'blue',
        // "line-color": ['match', ['get', '__code__'], '510116001013',  'red', 'blue'],
        "line-width": 1.5,
        height: ["+", ["get", "altitude"], 0.25],
      },
    });
    console.log("buildingLineLayer", MapClass.buildingLineLayer);
  }

  clear(): void {
    console.log('清除社区1');
    MapClass.neighborhoodLayer.layer.remove()
    console.log('清除网格1');
    MapClass.gridLayer.layer.remove()
    console.log('清除小区1');
    MapClass.buildingLineLayer.layer.remove()
    MapClass.neighborhoodLayer.layer.hide()
    console.log('清除线1');
    MapClass.neighborhoodLayer.layer.flyTo()
    MapClass.neighborhoodLayer.layer.clearHighlight()
    // MapClass.communityLayer.layer.fitView({
    //   padding: {
    //     left: 200,
    //     right: 200,
    //     top: 200,
    //     bottom: 100
    //   }
    // })
    // MapClass.communityLayer.layer.hide()
    // MapClass.neighborhoodLayer.layer.fitView()
  }
}

//小区级
class Level4 {
  // 文字图层
  massLayer: any = null

  init(): void {
    this.initGridLayer()
    this.initMassMarkerLayer()
  }

  // 从小区级别到网格级别
  changeToLevel(gridId: string): void {
    MapClass.level5 = new Level5()
    MapClass.level5.init()
    MapClass.gridLayer.layer.fitView({
      filter: ["==", "grid_id", gridId],
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100,
      },
    });
    MapClass.gridLayer.setHighlight({
      filter: ['==', 'grid_id', gridId],
      changeCamera: false
    })
    AreaStore.updateLevel(5)
    AreaStore.updateGridId(gridId)
  }

  clear(): void {
    console.log('重新初始化小区');
    MapClass.selectGridLayer.remove()
    console.log('移除小区名字成功');
    MapClass.level5.massLayer.layer.remove()
    console.log('移除楼栋名字成功');
    MapClass.neighborhoodLayer.layer.fitView()
    MapClass.gridLayer.layer.clearHighlight()
    MapClass.gridLayer.layer.hide()
    layer.remove()
    console.log('清除线2');
    // console.log(1000);
    /*MapClass.extrusionLayer.layer.fitView({
      padding: {
        top: 300,
        bottom: 300,
        left: 300,
        right: 300
      }
    })*/
    // MapClass.communityLayer.layer.fitView({
    //   // filter: ['==', 'grid_id', gridId],
    //   padding: {
    //     left: 200,
    //     right: 200,
    //     top: 200,
    //     bottom: 100
    //   }
    // })
    console.log('layer', layer)
    layer.remove()
  }
  // 初始化网格区域
  initGridLayer(): void {
    MapClass.gridLayer = new PolygonLayer({
      data: grid,
      // spatialReference: 'wgs84',
      style: {
        "fill-opacity": 0,
        "line-color": "green",
      },
      highlight: {
        style: {
          "line-color": "red",
          "line-width": 2,
          visibility: "none",
        },
      },
    });
    MapClass.gridLayer.layer.on("mousemove", (e: any) => {
      MapClass.gridLayer.setHighlight({
        filter: ['==', 'grid_id', e!.features[0]!.properties.grid_id],
        changeCamera: false
      })
    })
    MapClass.gridLayer.layer.on('mouseleave', () => {
      MapClass.gridLayer.layer.clearHighlight()
    })
    MapClass.gridLayer.layer.on('click', (e: any) => {
      console.log('e--------',e)
      // if (AreaStore.level === 1) {
      // MapClass.level4.changeToLevel(e!.features[0]!.properties.grid_id)
      // 清除level6图层
      MapClass.level6 && MapClass.level6.clear()
      // }
    });
  }
  // 初始化楼栋信息
  initMassMarkerLayer(): void {
    const { grid_id }: any = AreaStore.grid;
    const data = building.features.map((item: any) => {
      const center = turf.center(item);
      // 这里要深拷贝一下。
      center.properties = item.properties;
      return center;
    });
    this.massLayer = new MassMarkerLayer({
      mode: "3d",
      data: JSON.parse(
        JSON.stringify({
          type: "FeatureCollection",
          features: data,
        })
      ),
      // spatialReference: 'gcj02',
      minZoom: 17,
      style: {
        /*'text-field': ['concat', ['get', 'building'], '\n', ['get', 'unit']],
        'text-color': '#fff',
        'text-size': ['interpolate', ['linear'], ['zoom'], 16, 5, 22, 10],
        height: ['+', ['get', 'altitude'], 3]*/

        "text-field": [
          "match",
          ["get", "grid_id"],
          grid_id,
          ["get", "building"],
          "",
        ],
        "text-color": "white",
        "text-size": 4,
        height: ["+", ["get", "altitude"], 3],
      },
    });
  }

}

class Level5 {
  // 文字图层
  massLayer: any = null;

  init(): void {
    // 楼栋层级加单元的
    this.initMassMarkerLayer();
  }

  // 从网格级别到单元
  changeToLevel(data: any, uintId: string): void {
    console.log('data',data);
    AreaStore.updateUnitId(uintId)
    MapClass.level6 = new Level6()
    MapClass.level6.init(data)
    AreaStore.updateLevel(6)
  }

  clear(): void {
    console.log('重新初始化小区1111');
    MapClass.selectGridLayer.remove()
    console.log('移除小区名字成功1111');
    MapClass.level5.massLayer.layer.remove()
    console.log('移除楼栋名字成功1111');
    MapClass.gridLayer.layer.clearHighlight()
    console.log(888);
    MapClass.buildingLineLayer2.layer.remove()
    MapClass.gridLayer.layer.fitView({
      filter: ["==", "grid_id", AreaStore.gridId],
      padding: {
        left: 500,
        right: 500,
        top: 100,
        bottom: 100,
      },
    });
    MapClass.gridLayer.setHighlight({
      filter: ["==", "grid_id", AreaStore.gridId],
      changeCamera: false,
    });
  }
  // 初始化楼栋信息
  initMassMarkerLayer(): void {
    const {
      grid_id
    }: any = AreaStore.grid
    const data = building.features.map((item: any) => {
      const center = turf.center(item);
      center.properties = item.properties;
      return center;
    });
    this.massLayer = new MassMarkerLayer({
      mode: '3d',
      data: JSON.parse(JSON.stringify({
        type: 'FeatureCollection',
        features: data
      })),
      // spatialReference: 'wgs84',
      minZoom: 13,
      style: {
        "text-field": [
          "match",
          ["get", "grid_id"],
          grid_id,
          ["get", "building"],
          "",
        ],
        "text-color": "white",
        "text-size": 6,
        // 'text-offset': [0, 2],
        height: ["+", ["get", "altitude"], 3],
      },
    });
  }
}

// 到单元
export class Level6 {
  unitLayer: any = null
  init(data: any): void {
    const Data=data.filter((f:any)=>{
      return f.properties.grid_id === AreaStore.gridId
    })
    Data.forEach((f:any)=>{
      f.type='Feature'
    })
    const lineData: any[] = []
    Data.forEach((item: any) => {
      const line: any = turf.polygonToLine(item)
      lineData.push(...line.features)
    })
    // 清除grid的边框
    MapClass.gridLayer.layer.clearHighlight();
    // 增加单元图层
    /*this.unitLayer = new LineLayer({
      mode: "3d",
      data: JSON.parse(
        JSON.stringify({
          type: "FeatureCollection",
          features: lineData,
        })
      ),
      style: {
        "line-color": "#EFDD8C",
        "line-width": 2,
        height: ["+", ["get", "altitude"], 0.6],
      },
    });
    this.unitLayer.layer.flyTo();*/
  }

  clear(): void {
    // 移除当前的单元
    // this.unitLayer.layer.remove()
  }
}
