<template>
    <div class="block" :class="{'block-level': [2,3].includes(level)}">
      <div v-if="unit">
        <p class="name">
          <span style="font-size: 16px">{{value}} </span>{{unit}}
        </p>
        <p class="post">{{label}}</p>
      </div>
      <div v-else style="font-weight: bold">
        <p class="post" style="font-weight: bold;font-size: 14px">{{label}}</p>
        <p class="name">{{value}}</p>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'PostLevel'
})
export default class PostLevel extends Vue {
  @Prop()
  label: any

  @Prop()
  value: any

  @Prop()
  unit: any

  @Prop()
  level!: number
}
</script>

<style lang="scss" scoped>
  .block{
    display: inline-block;
    color: #B3FDEA;
    text-align: center;
    font-size: 16px;
    padding: 5px 3px;
    line-height: 20px;
    p{
      margin: 5px 3px;
    }
    .post{
      font-size: 0.2rem;
    }
    .name{
      font-size: 0.14rem;
    }
  }
  .block-level{
    width: 23%;
  }
</style>
