<template>
    <div class = movie>
        <Modal
            v-model="show"
            :title="this.movieInfo.title"
            width="850"
            footer-hide
            >
            
            
            <div class="info_l">
                    <div class="__r_c_" pan="M14_Movie_Overview_BaseInfo"><strong>导演：</strong>
                        <a  target="_blank">{{list_split(this.movieInfo.directors).join()}}</a>
                    </div>
                    <div class="__r_c_" pan="M14_Movie_Overview_BaseInfo"><strong>编剧：</strong>
                        <a  target="_blank">{{list_split(this.movieInfo.writers).join()}}</a>
                    </div>
                    <div class="__r_c_" pan="M14_Movie_Overview_BaseInfo">
                        <strong>国家地区：</strong>
                            <a href="http://movie.mtime.com/movie/search/section/?nation=USA" target="_blank">{{this.movieInfo.countries.join()}}</a>
                    </div>
                  <div class="__r_c_" pan="M14_Movie_Overview_BaseInfo">
                    <strong>片长：</strong>
                    <span   target="_blank">{{this.movieInfo.duration}} min</span>
                </div>
                    <div class="__r_c_" pan="M14_Movie_Overview_BaseInfo">
                        <strong>更多片名：</strong>
                            <span >{{this.movieInfo.aka.join()}}</span>
                            <a href="http://movie.mtime.com/12231/details.html" target="_self">...</a>
                    </div>

                    <div class="mov_pic">	
                        <a :href="this.movieInfo.poster" target="_blank" :title="this.movieInfo.title">
                            <img alt="暂无图片" width="96" height="128" class="img_box" :src="this.movieInfo.poster">
                        </a>	
                    </div>	
                    
            </div>
            
        </Modal>

        <div class="number">
            <em>{{this.rank+1}}</em>
        </div>	
        <div class="mov_pic">	
            <a :href="this.movieInfo.poster" target="_blank" :title="this.movieInfo.title">
                <img alt="暂无图片" width="96" height="128" class="img_box" :src="this.movieInfo.poster">
            </a>	
        </div>	
        <div class="mov_con" v-if="!loading">	
            <h2 class="title">
                <a class="c_blue" @click="show=true" target="_blank">
                {{this.movieInfo.title}}
                </a>
            </h2>		
            <div>导演： 
                <div  v-for="(direc,index) in this.movieInfo.directors" :key="index" style="display:inline;">
                    <a class="c_blue" target="_blank">
                        {{direc.name}}
                    </a>
                    &nbsp;
                </div>
            </div>		
            <div>主演： 
                <div  v-for="(actor,index) in this.movieInfo.casts.slice(0,3)" :key="index" style="display:inline;">
                    <a class="c_blue" target="_blank">
                        {{actor.name}}
                    </a>
                    &nbsp;
                </div>		
            </div>		
            <div>类型：
                <span class="c_blue">  
                    <div v-for="(type,index) in this.movieInfo.genres" :key="index" style="display:inline;">                       
                        <em v-if="index>0" class="c_blue"> / </em>
                        <a >{{type}}</a>
                    </div>	
                     <!-- <a class="c_blue" href="http://movie.mtime.com/movie/search/section/?type=Drama" target="_blank">剧情</a>	<em class="c_blue"> / </em> <a class="c_blue" href="http://movie.mtime.com/movie/search/section/?type=History" target="_blank">历史</a>		 -->
                </span>
            </div>		
                <p class="mt3">{{summary_slice(this.movieInfo.summary,105)}}</p>		
        </div>	
                    
    <div class="mov_point">  
        <b class="point"><span class="total">{{rating_split(this.movieInfo.rating.average,0)}}</span><span class="total2">.{{rating_split(this.movieInfo.rating.average,1)}}</span></b>  
        <p> {{this.movieInfo.rating.rating_people}}人评分  </p>
    </div>
    </div>
</template>

<script>

export default {
  props: ["movieInfo","rank"],
  created(){
        // console.log(this.movieInfo.directors)
  },
  mounted(){
      console.log("mounted")
    //   console.log(this.movieInfo.directors)
      this.directors = this.movieInfo.directors
      this.actors = this.movieInfo.casts
      this.genres = this.movieInfo.genres
      this.loading = false
  },
  updated(){
      console.log("updated")
    //   this.loading = true
      this.directors = this.movieInfo.directors
      this.actors = this.movieInfo.casts
      this.genres = this.movieInfo.genres
    //   console.log(this.directors)
    //   this.loading = false
  },
  methods:{
      summary_slice: function(summary,len){
          if(summary.length > len){
              return summary.slice(0,len)+"..."
          }
          return summary
      },
      rating_split: function(rating,location){
          var tmp = rating.split(".")
          if(location == 0){
              return tmp[0]
          } 
          else if(location == 1){
              return tmp[1]
          }
      },
      list_split: function(list){
          return list.map(x=>x.name).slice(0,3)
      }
  },
  data(){
            return{
                loading : true,
                show: false,
            }
        
    },
}
</script>


<style scoped>
.number{
    position: absolute;
    top: 0;
    left: -25px;
    width: 200px;
    height: 187px;
    color: #000;
    filter: alpha(opacity=10);
    -moz-opacity: .10;
    opacity: .10;
}

.number em {
    float: left;
    font-size: 12em;
    font-family: arial;
    font-style: italic;
    z-index: 1;
    letter-spacing: -7px;
}

.mov_pic {
    position: relative;
    float: left;
    z-index: 2;
    margin-left: 30px;
}

.mov_con {
    position: relative;
    width: 800px;
    padding-left: 150px;
    z-index: 2;
}

.mov_point {
    background-position: -384px -187px;
    text-align: center;
}

.mov_da{
    display:inline-block;
}

.mov_point {
    position: absolute;
    top: 0;
    right: -1px;
    width: 107px;
    height: 100%;
    text-align: center;
    background-position: -576px -187px;
    background-color: rgb(245, 244, 244);
}

.movie{
    position: relative;
    height: 167px;
    padding: 20px 0 0 65px;
    border-bottom: 1px solid #f6f6f6;
    overflow: hidden;
    background-color: rgb(248, 234, 234);
    width: 85%;
    margin-left: 10%;
}

.title{
    margin-bottom: 3px;
}

.mt3 {
    margin-top: 3px;
}

.point {
    position: relative;
    top: 70px;
    /* left: 33px; */
    font-family: tahoma;
    font-weight: bold;
    /* float: left; */
    display: inline;
}

.mov_point .total {
    font-size: 3em;
    padding: 1px 0;
    /* float: left; */
    display: inline;
    color: #f07200;
    line-height: 1em;
}

/* .info_l {
    float: left;
    display: inline;
    width: 850px;
    margin-left: 6px;
} */

.info_l .__r_c_ {
    border-bottom: 1px dotted #999;
    position: relative;
    zoom: 1;
    padding: 10px 0px 5px 10px;
    line-height: 1.5em;
    font-size: 13px;
    width: 80%;
}

.info_l .mov_pic {
    float: right;
    position: relative;
    bottom: 150px;
    right: 20px;
}

.total2 {
    font-size: 1.8em;
    color: #f07200;
}
</style>

