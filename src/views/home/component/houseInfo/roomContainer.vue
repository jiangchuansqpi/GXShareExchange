<template>
  <div class="room-container">
    <div class="unit-room-title">
      {{ roomName }}
    </div>
    <div class="room-box">
      <div class="room-item-box" :key="item[0].floors" v-for="item in roomData">
        <div class="room-container">
          <div
            style="margin-bottom: 10px"
            v-for="room in item"
            :key="room.roomId"
          >
            <div class="room-item" @click="detail(room)">
              {{ room.roomNumber }}
            </div>
            <div class="tag">
              <img v-if="room.isImmuneFamily === '是'" :src="ju" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <HouseDetail ref="hd" />
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { AreaStore } from "@/store/areaDetail";
import HouseDetail from "@/views/home/component/houseInfo/HouseDetail.vue";
import { getRoom } from "@/api";

@Component({
  name: "roomContainer",
  components: {
    HouseDetail,
  },
})
export default class RoomContainer extends Vue {
  ju = require("@/assets/img/juj.png");

  roomData: any = [];
  roomName: any = "";
  roomId:any=''

  mounted() {
    this.initRoom();
  }

  async initRoom() {
    const gb = AreaStore.adr_.split("-");
    console.log("gb", gb);
    const room = await getRoom(AreaStore.unitId, gb[1], gb[2]);
    console.log("room", room);
    const roomFilter = room.data.filter(
      (item: any) => item.unitId == AreaStore.unitId
    );
    console.log("roomFilter", roomFilter);
    const data: any = [];
    const removeRepeat = new Set(roomFilter.map((item: any) => item.floors));
    console.log("removeRepeat", removeRepeat);
    removeRepeat.forEach((item: any) => {
      const filter = roomFilter.filter(
        (building: any) => item === building.floors
      );
      data.push(filter);
    });
    this.roomName = data[0][0].building + data[0][0].unit;
    this.roomData = data;
    console.log("roomName", this.roomName);
    console.log("data", this.roomData);

    // const m = new MapClass();
    // m.mouseEvent1();
  }

  detail(val: any) {
    console.log('val',val);
    
    (this.$refs.hd as any).toggle(true, val.roomId);
  }
}
</script>

<style lang="scss" scoped>
.room-container {
  .unit-room-title {
    text-align: center;
    font-size: 20px;
    color: #fffa81;
  }

  .room-box {
    height: calc(100% - 34px);
    overflow: auto;

    .room-item-box {
      .room-title {
        color: #fff;
        font-size: 18px;
        /* height: 30px; */
        line-height: 30px;
        padding: 10px 10px 0 10px;
      }

      .room-container {
        padding: 3%;
        border-bottom: 1px solid #076b88;
        //padding-bottom: 20px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .room-item {
          display: inline-block;
          background-image: url(~@/assets/img/unit-bg.png);
          background-size: 100% 100%;
          width: 85px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          font-weight: 500;
          color: #00ffbc;
          cursor: pointer;
          margin: 10px 20px 5px;
        }
        .tag {
          text-align: center;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .room-box::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    /*滚动条滑块*/
    .room-box::-webkit-scrollbar-thumb {
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      // background: rgb(0, 0, 0, 0.7)
      background-color: #05e3d0;
    }

    /*滚动条里面轨道*/
    .room-box::-webkit-scrollbar-track {
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
    }

    /*滚动条的小边角*/
    .room-box::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}
</style>
