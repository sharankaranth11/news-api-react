import React, { Component } from 'react'
import Spinner from './Spinner';
import NewsItems from './NewsItems'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
    static defaultaProps = {
            country:'in',
            pageSize:8,
            category:'general'
    }
    static propTypes = {
            country: PropTypes.string,
            pageSize: PropTypes.number,
            category:PropTypes.string
        
    }
   capitalizeFirstLetter=(string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
   }
    constructor(props){
        super(props);
       
        this.state ={
                articles: [],
                loading: false,
                page:1,
                totalResults:0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)}-Peoples News`;
    }
    async updateNews(){
       this.props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json()
        this.props.setProgress(70);
        this.setState({articles:parsedData.articles,
            totalResults:parsedData.totalResults,
            loading:false})
            this.props.setProgress(100);
    }
   async componentDidMount(){
    this.updateNews();
    }

    // handleNextClick = async ()=>{
    //     this.setState({page:this.state.page+1});
    //     this.updateNews();
    // }
    // handlePrevClick = async ()=>{
    //     this.setState({page:this.state.page-1});
    //     this.updateNews();
        
    // }
    fetchMoreData = async () => {
        this.setState({page: this.state +1});
        const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data = await fetch(url);
        let parsedData = await data.json()
        this.setState({
            articles:this.state.articles.concat(parsedData.articles),
            totalResults:parsedData.totalResults,
            loading:false})
      };
   
    render() {
        return (
            <>
                <h1 className="text-center">Peoples News - Top Headlines   {this.capitalizeFirstLetter(this.props.category)}</h1>
                {/* {this.state.loading && <Spinner/>} */}
                <InfiniteScroll
                dataLength={this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles.length!==this.state.totalResults}
                loader={<Spinner/>}>
                    <div className="container">

                
                <div className="row">
                {this.state.articles.map((element)=>{
                    return  <div className="col-md-4" key ={element.url}>
                    <NewsItems   title={element.title?element.title:""} 
                    description={element.description?element.description:""}
                    imageUrl={element.urlToImage} newsUrl={element.url} 
                    author={element.author} date={element.publishedAt} 
                    source = {element.source.name}/>
                    </div>
                    })}     
                </div>
                </div>
                </InfiniteScroll>
                {/* <div className="conatainer d-flex justify-content-between">
                <button disabled ={this.state.page<=1} type="button" className="btn btn-dark " onClick={this.handlePrevClick}>&larr;Previous</button>
                <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark "onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

export default News