// import React, { Component, useState, useRef } from 'react';
import React, { Component} from 'react';
import axios from 'axios';
// import Auth from "../../auth/auth";
// import Info from '../../api/Info';
// import Toasts from '../common/Toasts'
// import PreLoginHomePage from './PreLoginHomePage'
// import PostLoginHomePage from './PostLoginHomePage'

export class HomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageUrl: "",
            selectedFile: "",
            visionApiData: "",
            uploadMessage: "",
            uploadMessageClass: "",
            dataReceived: false,
            loading:false,
            responseImage:""
        }
    
    this.fileInput = React.createRef();
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    }


    fileSelectedHandler(event) {
        //console.log(event.target.files[0]);
        this.setState({
          selectedFile: event.target.files[0],
          uploadMessage: "",
          uploadMessageClass: "",
          dataReceived: false
        });
      }
    

    async fileUploadHandler() {

        // let backendUploadUrl = "http://localhost:4000/upload"
        let backendUploadUrl = "https://fgr-license-plate-backend.azurewebsites.net/image"
    
        let tryupload = false;
        //console.log("this.state.selectedFile: ", this.state.selectedFile);
    
          //Check The file type
          const regex = RegExp(/\.(jpe?g|png|bmp)$/i);
          if (regex.test(this.state.selectedFile.name)) {
            tryupload = true;
            this.setState({
              uploadMessage: "Uploading image...",
              uploadMessageClass: "uploadGoodWaitingForData"
            });
          } else {
            this.setState({
              uploadMessage: "Please upload a file with the following extension jpg,jpeg,png,bmp",
              uploadMessageClass: "uploadGoodWaitingForData"
            });
          }
    
    
        
        this.setState({loading:true})
        if (tryupload) {
          try {
            const fd = new FormData();
            // fd.append("title", this.state.selectedFile.name);
            // fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
            fd.append("images", this.state.selectedFile, this.state.selectedFile.name);
            const responseImage = await axios.post(
              backendUploadUrl,
              fd,
              {responseType: 'blob'}
            );
            let url = URL.createObjectURL(responseImage.data)
                console.log("url: ",url)
            // let responseimg = Buffer.from(responseImage.data, 'binary').toString('base64')

            // console.log("responseImage",responseImage)
            //console.log(res.data)
            // this.setState({ responseImage: responseimg });
            this.setState({ responseImage: url });

            console.log("this.state.responseImage",this.state.responseImage)
            this.setState({loading:false})
            // if (this.state.imageUrl) {
            //   this.setState({
            //     uploadMessage: "Waiting for data...",
            //     uploadMessageClass: "uploadGoodWaitingForData"
            //   });
            // } else {
            //   this.setState({
            //     uploadMessage: "Sorry something went wrong with upload",
            //     uploadMessageClass: "error"
            //   });
            // }
    
            // const data = await VisionApi.getPictureData(res.data);
            // this.setState({ visionApiData: data });
            // if (this.state.visionApiData) {
            //   this.setState({
            //     uploadMessage: "Data Received!",
            //     uploadMessageClass: "success",
            //     dataReceived: true
            //   });
            // } else {
            //   this.setState({
            //     uploadMessage: "Sorry something went wrong computer vision api",
            //     uploadMessageClass: "error"
            //   });
            // }
          } catch (err) {
            console.log(err);
          }
        }
    
      }
    


    render() {

        // let { loading } = this.state
        // const fileInput = useRef(null)
        return (
            <div>

                {/* {loading && <h2>Loading...</h2>} */}

            <h1>HOME PAGE</h1>
            
            <h4>Upload Image</h4>
            {this.state.selectedFile && <button onClick={this.fileUploadHandler} >UPLOAD</button>}
            
              {/* <div className="input-group-prepend">
                <span
                  
                  className="input-group-text uploadBtn"
                  id="inputGroupFileAddon01"
                >
                  Upload
                </span>
              </div> */}
              <div className="custom-file">
                {/* <input
                  onChange={this.fileSelectedHandler}
                  type="file"
                  className="custom-file-input uploadInput"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                /> */}


                <button
                className='upload-btn'
                onClick={() => this.fileInput.current.click()}
                >Choose File</button>
                <input
                type='file'
                name='image'
                ref={this.fileInput}
                onChange={this.fileSelectedHandler}
                style={{ display: 'none' }}
                />
                {this.state.selectedFile && <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.selectedFile.name} </label>}
              </div>
            
                {this.state.loading && <h3>LOADING...</h3>}

            {this.state.responseImage && <img src={this.state.responseImage} width="400" alt="response image" />}
                {/* {this.state.responseImage && <img src={'data:image/jpeg;base64,' + this.state.responseImage} width="100" alt="response image" />} */}
                {/* {this.state.responseImage && <img src={`data:image/jpeg;base64,${btoa(this.state.responseImage)}`} />} */}

            </div>
        )
    }
}

export default HomePage

// function hexToBase64(str) {
//     return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
// }