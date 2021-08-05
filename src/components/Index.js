import React from 'react'
import ContentPanel from './ContentPanel'
import Header from './Header'
import "./Index.css"

export default function Index() {
    return (
        <div className="container">
            <Header/>
            <ContentPanel/>            
        </div>
    )
}
