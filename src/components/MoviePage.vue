<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    background: #515a6e;
    color: #f5f7f9;
    border-radius: 3px;
    float: left;
    position: relative;
    left: 20px;
}
.layout-nav{
    /* width: 420px; */
    margin: 0 auto;
    margin-left: 20px;
    float: right;
}
.layout-footer-center{
    text-align: center;
}
.search{
    width: 75%;
    margin-left: 10%;
}
.footer{
    margin-top: 20px;
}
.resultStats{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: right;
    line-height: 43px;
    color: #777;
    padding-left: 16px;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 8px;
}

#movie_list{
    position: relative;
}

.db_bodybg {
    /* background: no-repeat #486AF6 center 0; */
    background-size:100% 100%;
    background-image: url(http://img31.mtime.cn/mg/2014/09/22/165333.90197273.jpg);
}

.notfound{
    /* min-height: 400px; */
    margin-top: 100px;
    color: #666699;
}

.notfound .title{
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 30px;
    color: rgb(73, 73, 73);
    padding: 0px;
}


</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"><h3>web电影热榜</h3></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <div >
                                <Button v-if="!select" @click="select = true" type="primary" shape="circle" icon="ios-search"></Button>
                                <Icon v-if="select" @click="select = false" type="ios-arrow-dropleft" />
                                <Input 
                                    v-model="input" 
                                    v-if="select" 
                                    class="search" 
                                    @on-search="searchBackEnd"
                                    search placeholder="Enter something..." />
                            </div>
                        </MenuItem>
                        <!-- <MenuItem name="2" @click.native="click()">
                            <Icon type="ios-keypad"></Icon>
                            数据可视化
                        </MenuItem> -->
                        <MenuItem name="3" @click.native="click()">
                            <Icon type="ios-analytics"></Icon>
                            电影详情
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout :style="{padding: '0 50px'}">
                <Content :style="{padding: '24px 20px', minHeight: '280px', background: '#fff'}">
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}">
                            <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']" >
                                <Submenu name="1">
                                    <template slot="title">
                                        <Icon type="ios-navigate"></Icon>
                                        语言
                                    </template>
                                    <MenuItem name="1-1" @click.native="filterlanguageBackEnd('英语')">英语</MenuItem>
                                    <MenuItem name="1-2" @click.native="filterlanguageBackEnd('汉语')">汉语</MenuItem>
                                    <MenuItem name="1-3" @click.native="filterlanguageBackEnd('日语')">日语</MenuItem>
                                </Submenu>
                                <Submenu name="2">
                                    <template slot="title">
                                        <Icon type="ios-keypad"></Icon>
                                        类型
                                    </template>
                                    <MenuItem name="2-1" @click.native="filtertypeBackEnd('喜剧')">喜剧</MenuItem>
                                    <MenuItem name="2-2" @click.native="filtertypeBackEnd('剧情')">剧情</MenuItem>
                                    <MenuItem name="2-3" @click.native="filtertypeBackEnd('动作')">动作</MenuItem>
                                </Submenu>
                            </Menu>
                        </Sider>
                        <Content :style="{padding: '5px', minHeight: '280px', background: '#fff'}">
                            <div class="resultStats">找到 {{this.size}} 条结果<nobr> （用时 {{this.timeUse}} 毫秒）&nbsp;</nobr></div>
                            <div v-if="isSucc&&!loading">
                                <ul id="movie_list" >
                                    <li v-for="(movie,index) in this.showData" :key="index">
                                        <movie :movieInfo="movie" :rank="(currentPage-1)*pageSize+index"></movie>
                                    </li>
                                </ul>
                                <Page :total="size" :page-size="pageSize" @on-change="pageChangeBackEnd" show-elevator class="footer"/>
                            </div>
                            <div v-else class="notfound">
                                <h1 class="notfound title">搜索 {{this.name}} </h1>
                                <h3> 没有找到关于 “{{this.name}}”相关的内容，换个搜索词试试吧</h3>
                            </div>
                        </Content>
                    </Layout>
                    
                </Content>
                
            </Layout>
            <Footer class="layout-footer-center">2011-2019 &copy; ChenLu</Footer>
        </Layout>
    </div>
</template>

<script>
    import Item from "@/components/MovieItem";
    import movieList from "@/components/data";
    import getExecTime from "@/components/getExeTime";

    // var host = "http://localhost:8081/"
    var host = "118.25.157.138:8081/"
    var nameurl = host+"GetFilmByName";
    var typeurl = host+"GetFilmByType";
    var langurl = host+"GetFilmByLanguage"

    export default {
        data(){
            return{
                select: false,
                input: "",
                pageSize: 10,
                loading: false,
                currentPage: 1,
                timeUse: 0,
                focus: "lan",  //当前显示的结果来自哪个接口
                lan: "汉语",
                type: "",
                name: "",
                showData: [],
                size: 0,
                isSucc: true,
            }
            
        },
        created: function(){
            // this.allData = movieList.sort(function(a,b) {
            //     return b.rating.average - a.rating.average
            // });
            // this.sourceData = this.allData
            // console.log("movie loaded")
            // this.filterlanguage('zh')
            this.filterlanguageBackEnd('汉语')
        },
        methods:{
            
            filterlanguage: function(lan) 
            {
                var that = this
                getExecTime(function(){
                    console.log("filter lan "+lan)
                    // debugger
                    if(lan == "en"){
                        that.sourceData = that.allData.filter(item => {
                            return item.languages.indexOf("英语") > -1;
                        });
                    }
                    else if(lan == "zh"){
                        that.sourceData = that.allData.filter(item => {
                            return item.languages.indexOf("汉语普通话") > -1 || item.languages.indexOf("粤语") > -1;
                        });
                    }
                    else{
                        that.sourceData = that.allData.filter(item => {
                            return item.languages.indexOf("汉语普通话") == -1 && item.languages.indexOf("粤语") == -1 && item.languages.indexOf("英语") == -1 ;
                        });
                    }
                    // console.log(this.sourceData)
                    
                    that.pageChange(1)
                },this)();
            },
            filterlanguageBackEnd: function(lan){
                this.lan = lan
                this.focus = 'lan'
                this.pageChangeBackEnd(1)
            },
            filtertype: function(type){
                var that = this
                getExecTime(
                    function(){
                        console.log("filter type "+type)
                        // debugger
                        if(type == "喜剧"){
                            that.sourceData = that.allData.filter(item => {
                                return item.genres.indexOf("喜剧") > -1;
                            });
                        }
                        else if(type == "剧情"){
                            that.sourceData = that.allData.filter(item => {
                                return item.genres.indexOf("剧情") > -1 ;
                            });
                        }
                        else{
                            that.sourceData = that.allData.filter(item => {
                                return item.genres.indexOf("喜剧") == -1 && item.genres.indexOf("剧情") == -1 ;
                            });
                        }
                        console.log(that.sourceData)
                        
                        that.pageChange(1)
                    },this)();
            },
            filtertypeBackEnd(type){
                this.type = type
                this.focus = 'type'
                this.pageChangeBackEnd(1)
            },
            click: function(){
                this.$Message.info("点击电影标题了解更多:)")
            },
            getJson: function(){
                this.$http.get('static/data.json').then(
                    res=>{
                        this.movieList = res.body
                        console.log("succ")
                    },
                    err=>{
                        console.log(err)
                    }
                )
            },
            search: function(){
                var that = this
                getExecTime(
                    function(){
                        console.log(that.input)
                        that.loading = true
                        if(that.input == ""){
                            that.sourceData = that.allData
                            that.$Message.info("请不要输入空白字符哦！")
                        }
                        else{
                            that.sourceData = that.sourceData.filter(item => {
                                return item.title.toLowerCase().indexOf(that.input.toLowerCase()) > -1;
                            });
                            
                        }
                        that.pageChange(1)
                        that.loading = false
                },this)();
            },
            searchBackEnd(){
                console.log(this.input)
                this.focus = "name"
                this.name = this.input
                this.pageChangeBackEnd(1)
            },
            //页数变化回调
            pageChange(index) {
                this.size = this.sourceData.length
                this.loading = true
                console.log("pageChange")
                var start = (index - 1) * this.pageSize;
                var end = index * this.pageSize;
                this.showData = this.sourceData.slice(start, end);

                // console.log(this.showData)
                //this.arr[0]=[2,4];
                // debugger
                // for (var i = 0; i < tmp.length; i++) {
                //     this.$set(this.showData,i,tmp[i]);
                // }
                
                this.currentPage = index
                this.loading = false
            },
            pageChangeBackEnd(index) {
                var that = this
                getExecTime(
                    function(){
                    console.log("pageChangeBackEnd " + index)
                    console.log("current focus "+that.focus)
                    if(that.focus == "lan"){
                        var requestUrl = langurl
                        var para = that.lan
                    }
                    else if(that.focus == "name"){
                        var requestUrl = nameurl
                        var para = that.name
                    }
                    else if(that.focus == "type"){
                        var requestUrl = typeurl
                        var para = that.type
                    }
                    that.$http
                    .get(requestUrl, {
                        params: { 
                            para: para,
                            page: index
                        }
                    })
                    .then(
                        res => {
                            // 响应成功回调
                            // 请求结果有问题
                            that.loading = true
                            that.isSucc = true
                            if(res.body.hasOwnProperty("err")){
                                console.log("请求结果有问题")
                                that.isSucc = false
                            }
                            that.showData = res.body.data
                            that.size = res.body.total
                            console.log(res.body);
                            that.loading = false
                        },
                        res => {
                            // 响应错误回调
                            console.log("pageChange request fail");
                        }
                    );

                    that.currentPage = index
                },this)();
            }
        },
        components: {
            movie: Item
        },
        computed: {
            
        }
    }
</script>