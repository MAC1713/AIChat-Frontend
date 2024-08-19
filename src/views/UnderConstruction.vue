<template>
    <div class="under-construction">
      <h1>404 - 页面正在建设中</h1>
      <div class="robot">
        <div class="antenna"></div>
        <div class="head">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="mouth"></div>
        </div>
        <div class="body">
          <div class="arm left"></div>
          <div class="arm right"></div>
        </div>
      </div>
      <p>我们的Emma正在努力建设这个页面,请稍后再来看看!</p>
      <button @click="goHome">返回首页</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'UnderConstruction',
    setup() {
      const router = useRouter()
  
      const goHome = () => {
        router.push('/')
      }
  
      return {
        goHome
      }
    }
  })
  </script>
  
  <style scoped>
  .under-construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .robot {
    position: relative;
    width: 200px;
    height: 250px;
    margin-bottom: 20px;
  }
  
  .antenna {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 20px;
    background-color: #333;
  }
  
  .head {
    position: relative;
    width: 100px;
    height: 100px;
    background-color: #4a90e2;
    border-radius: 50%;
    margin: 0 auto;
  }
  
  .eye {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    top: 30px;
  }
  
  .eye.left {
    left: 20px;
  }
  
  .eye.right {
    right: 20px;
  }
  
  .mouth {
    position: absolute;
    width: 40px;
    height: 10px;
    background-color: #fff;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0 0 20px 20px;
  }
  
  .body {
    position: relative;
    width: 150px;
    height: 150px;
    background-color: #4a90e2;
    margin: -50px auto 0;
    border-radius: 50px 50px 25px 25px;
  }
  
  .arm {
    position: absolute;
    width: 30px;
    height: 100px;
    background-color: #4a90e2;
    top: 20px;
  }
  
  .arm.left {
    left: -20px;
    transform: rotate(20deg);
  }
  
  .arm.right {
    right: -20px;
    transform: rotate(-20deg);
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4a90e2;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #3a7bc8;
  }
  </style>