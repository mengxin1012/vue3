import type {App} from 'vue'
import pinia from '@/stores'
import { useUserInfoStore } from '@/stores/userInfo' 
export default function(app:App){
  app.directive('has',{
    mounted(el,bindings) {
      let buttons = useUserInfoStore(pinia).userInfo.buttons
      if(buttons.indexOf(bindings.value) === -1){
        el.parentNode.removeChild(el)
      } 
    },
  })
}