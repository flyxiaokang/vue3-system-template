/// <reference types="element-plus/global" />
import * as ElementPlusGlobal from "@vue/runtime-core";
declare module "vue" {
  interface ComponentCustomProperties extends ElementPlusGlobal.GlobalComponents {}
}
