var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html


var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'App.jsx'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/pxq/dist'); //发布文件所存放的目录

module.exports = {
    devtool: 'cheap-module-eval-source-map',//生成Source Maps,这里选择cheap-module-eval-source-map

    /*devtool选项   配置结果
    source-map  在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度

    cheap-module-source-map 在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便

    eval-source-map 使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。
    这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项

    cheap-module-eval-source-map    这是在打包文件时最快的生成source map的方法，生成的Source Map会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点*/

    entry: {
        app: APP_FILE//唯一入口文件
    },
    output: {  //输出目录
        publicPath: '/pxq/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //编译到当前目录    //打包后的js文件存放的地方
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },

    /*
        chunkname  我的理解是未被列在entry中，却又需要被打包出来的文件命名配置。什么场景需要呢？我们项目就遇到过，在按需加载（异步）模块的时候，这样的文件是没有被列在entry中的，如使用CommonJS的方式异步加载模块：

        require.ensure(["modules/tips.jsx"], function(require) {
            var a = require("modules/tips.jsx");
            // ...
        }, 'tips');
        异步加载的模块是要以文件形式加载哦，所以这时生成的文件名是以chunkname配置的，生成出的文件名就是tips.min.js。

        （require.ensure() API的第三个参数是给这个模块命名，否则 chunkFilename: "[name].min.js" 中的 [name] 是一个自动分配的、可读性很差的id，这是我在文档很不起眼的地方1.5K发现的。。。）
    */


    /*总的来说webpack loader可以实现：

    可以将React JSX语法转为js语句 
    React开发中支持ES6语法 
    支持通过import来直接引入css、less、sass甚至是图片 
    支持css中引用的图片大小在某一大小范围之内直接转为BASE64格式等等等*/

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/, //屏蔽不需要处理的文件（文件夹）（可选）
            loader: 'babel',
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer']),
            include: [APP_PATH]
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'less']),
            include: [APP_PATH]
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass']),
            include: [APP_PATH]
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel'],
            include: [APP_PATH]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development') //定义编译环境
            }
        }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/template/index.html', //html模板路径
            hash: false,
        }),
        new ExtractTextPlugin('[name].css')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    }
};
