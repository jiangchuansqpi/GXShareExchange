<!--
 * @Description:
 * @Author: xeno.zhang
 * @Date: 2021-12-17 11:40:31
 * @LastEditTime: 2021-12-17 13:06:47
 * @LastEditors: xeno.zhang
 * @Reference:
-->
<template>
  <div>
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="content">
        <div v-for="(item,idx) in list" :key="idx">
          <div v-if="item[1]" class="line">
            <span>{{ item[0] }}</span>
            <span>{{ item[1] }}</span>
          </div>
          <div v-else style="cursor: pointer; width: 100%; text-align: center;line-height: 50px;">
            <span @click="test">{{ item[0] }}</span>
          </div>
        </div>
      </div>
    </div>
    <PeopleDetail ref="pd"/>
  </div>
</template>

<script>
import {Component, Prop, Vue} from "vue-property-decorator";
import PeopleDetail from './PeopleDetail.vue'

@Component({
  name: 'InfoPanel',
  components: {
    PeopleDetail,
  },
})
export default class InfoPanel extends Vue {
  // 房屋人群列表
  @Prop()
  title

  @Prop()
  list

  test() {
    // (this.$refs.pd as any).toggle(true)
    this.$refs.pd.toggle(true)
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 30px);
  width: 100%;
  overflow: hidden;
}

.title {
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
}

.line {
  display: flex;
  justify-content: space-between;
  padding: 10px 5px;
  width: calc(100% - 20px);
  font-size: 12px;
  background: #033a3be8;
  margin: 5px 4px;
}

.container {
  color: #08dee1;
  width: 180px !important;
  height: 200px !important;
  background: #034748c4;
  border-radius: 7px;
}
</style>
