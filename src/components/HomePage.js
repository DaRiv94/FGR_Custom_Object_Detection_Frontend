// import React, { Component, useState, useRef } from 'react';
import React, { Component } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
// import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./HomePage.css"
import Loader from "react-loader-spinner";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        backgroundColor: "red"
    }
});
// import Auth from "../../auth/auth";
// import Info from '../../api/Info';
// import Toasts from '../common/Toasts'
// import PreLoginHomePage from './PreLoginHomePage'
// import PostLoginHomePage from './PostLoginHomePage'

// const useStyles = makeStyles((theme) => ({
//     root: {
//       display: 'flex',
//       '& > * + *': {
//         marginLeft: theme.spacing(2),
//       },
//     },
//   }));

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
            loading: false,
            responseImage: "",
            message: "Select a file to upload."

        }

        this.fileInput = React.createRef();
        this.fileUploadHandler = this.fileUploadHandler.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    }


    fileSelectedHandler(event) {

        //Check The file type
        const regex = RegExp(/\.(jpe?g|png|bmp)$/i);
        if (regex.test(event.target.files[0].name)) {
            this.setState({
                selectedFile: event.target.files[0],
                message:"Upload Image to test detection"
            });
        } else {
            this.setState({
                message: "Please upload a file with the following extension jpg,jpeg,png,bmp"
            });
        }
        //console.log(event.target.files[0]);
        
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



        this.setState({ loading: true })
        if (tryupload) {
            try {
                const fd = new FormData();
                // fd.append("title", this.state.selectedFile.name);
                // fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
                fd.append("images", this.state.selectedFile, this.state.selectedFile.name);
                const responseImage = await axios.post(
                    backendUploadUrl,
                    fd,
                    { responseType: 'blob' }
                );
                let url = URL.createObjectURL(responseImage.data)
                console.log("url: ", url)
                // let responseimg = Buffer.from(responseImage.data, 'binary').toString('base64')

                // console.log("responseImage",responseImage)
                //console.log(res.data)
                // this.setState({ responseImage: responseimg });
                this.setState({ responseImage: url });

                console.log("this.state.responseImage", this.state.responseImage)
                this.setState({ loading: false,
                message: "Success! View Image below" })
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
        const { classes } = this.props;

        // let { loading } = this.state
        // const fileInput = useRef(null)
        return (
            <div className="redBox">
                {/* <div id={!this.state.loading ? "grayout":""} className="redBox"> */}

                {/* {loading && <h2>Loading...</h2>} */}

                <h1 className="topheader">License Plate Detector!</h1>

                <p className="uploadheader">{this.state.message}</p>

                <div className="fileLabeldiv">
                    {this.state.selectedFile && <label className="fileLabel" htmlFor="inputGroupFile01">{this.state.selectedFile.name} </label>}
                </div>

                <div className="uploadbtndiv">
                    {this.state.selectedFile && <button className={ !this.state.loading ?"uploadbtn":"uploadbtn disabledbtn" }
                      onClick={this.fileUploadHandler} >Upload</button>}
                </div>

 

                <div className="selectfilebtndiv ">
                    <button
                        className={ !this.state.loading ?"selectfilebtn":"selectfilebtn disabledbtn" }
                        onClick={() => this.fileInput.current.click()}
                        disabled={this.state.loading}
                    >Select File</button>
                </div>

                { this.state.loading && <div className="loaderDiv" > 
                <Loader type="ThreeDots" color="#48b749" height={90} width={90} />
                </div>}
                


                <input
                    type='file'
                    name='image'
                    ref={this.fileInput}
                    onChange={this.fileSelectedHandler}
                    style={{ display: 'none' }}
                />


                {/* {this.state.loading &&
                <div className={"redBox"}>
                <CircularProgress />
                <CircularProgress color="secondary" />
              </div>}
                {!this.state.loading &&
                <Backdrop className={classes.backdrop} open={this.state.loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              } */}
                <Backdrop className={classes.backdrop} open={this.state.loading}>
                    
                </Backdrop>

                
                {this.state.responseImage && <div className="pictureDiv col-12 col-md-6">
            {/* <h4>Image</h4> */}
            <div className="imageBox">
              {" "}
              <img
                src={this.state.responseImage}
                alt={this.state.responseImage === "" ? "" : "Couldnt find image"}
              />
            </div>
          </div>}

                {/* {this.state.responseImage && <img src={this.state.responseImage} width="90vw" alt="response image" />} */}


            </div>
        )
    }
}


export default withStyles(styles)(HomePage);
// export default HomePage

// function hexToBase64(str) {
//     return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
// }