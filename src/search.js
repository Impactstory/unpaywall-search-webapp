import axios from 'axios'
import _ from 'lodash'

export const search = {
    apiBaseUrl: "https://gtr-api.herokuapp.com/search/",
    loading: false,
    results: [],
    entities: [],
    selectedEntity: null,

    query: {
        q: "",
        oa: false,
        annotations: true,
        page: 1,
        zoom: null
    },
    queryDefaults: {
        q: "",
        oa: false,
        annotations: true,
        page: 1,
        zoom: null
    },
    cachedQuery: {},


    apiQueryUrl: function(){
        return this.apiBaseUrl + this.query.q
            + "?page=" + this.query.page
            + "&oa=" + this.query.oa
    },



    fetchResults: function(){
        this.loading = true
        this.results = []
        let request = axios.get(this.apiQueryUrl())
            .then(resp => {
                console.log("got query results back", resp.data)
                this.results = resp.data.results
                this.entities = resp.data.annotations
            })
            .catch(e=> {
                console.log("search error", e)
            })
            .finally(() =>{
                this.loading = false
            })
        return request
    },

    setQuery(queryObj){
        Object.keys(this.queryDefaults).forEach(k => {
            let newVal = queryObj[k]
            if (newVal === "false") newVal = false

            if (typeof newVal === "undefined") {
                this.query[k] = this.queryDefaults[k]
            }
            else {
                this.query[k] = newVal
            }
        })

        // this.query.annotations = false

        console.log("query.anno", this.query.annotations)
    },

    setQ(q){
        this.query.q = _.snakeCase(q.toLowerCase())
    },

    setZoom(doi){
        this.query.zoom = doi
    },

    setSelectedEntity(id){
        console.log("setting entity", id)
        if (this.entities[id]){
            this.selectedEntity = this.entities[id]
        }
        else {
            this.selectedEntity = null
        }
    },

    getQueryForUrl(){
        let newUrlQueryObj = {}
        Object.keys(this.queryDefaults).forEach(k => {
            if (this.query[k] !== this.queryDefaults[k]) {
                newUrlQueryObj[k] = this.query[k]
            }
        })
        return newUrlQueryObj
    }







}