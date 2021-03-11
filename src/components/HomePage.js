import React, { Component } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./HomePage.css"
import Loader from "react-loader-spinner";

export class HomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedFile: "",
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
                message: "Upload Image to test detection"
            });
        } else {
            this.setState({
                message: "Please upload a file with the following extension jpg,jpeg,png,bmp"
            });
        }
    }


    async fileUploadHandler() {
        let backendUploadUrl = "https://fgr-license-plate-backend.azurewebsites.net/image"
        let tryupload = false;

        //Check The file type again for safe measure
        const regex = RegExp(/\.(jpe?g|png|bmp)$/i);
        if (regex.test(this.state.selectedFile.name)) {
            tryupload = true;
        } else {
            this.setState({
                message: "Please upload a file with the following extension jpg,jpeg,png,bmp"
            });
        }
        
        this.setState({ loading: true })
        if (tryupload) {
            try {
                const fd = new FormData();
                fd.append("images", this.state.selectedFile, this.state.selectedFile.name);
                const responseImage = await axios.post(
                    backendUploadUrl,
                    fd,
                    { responseType: 'blob' }
                );
                let url = URL.createObjectURL(responseImage.data)
                this.setState({
                    responseImage: url,
                    loading: false,
                    message: "Success! View Image below"
                })
            } catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        return (
            <div>
                <h1 className="topheader">License Plate Detector!</h1>

                <p className="uploadheader">{this.state.message}</p>

                <div className="fileLabeldiv">
                    {this.state.selectedFile && <label className="fileLabel" >{this.state.selectedFile.name} </label>}
                </div>

                <div className="uploadbtndiv">
                    {this.state.selectedFile && <button className={!this.state.loading ? "uploadbtn" : "uploadbtn disabledbtn"}
                        onClick={this.fileUploadHandler} >Upload</button>}
                </div>

                <div className="selectfilebtndiv ">
                    <button
                        className={!this.state.loading ? "selectfilebtn" : "selectfilebtn disabledbtn"}
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

                <Backdrop open={this.state.loading}>

                </Backdrop>

                {this.state.responseImage && <div className="pictureDiv">
                    <div className="imageBox">
                        {" "}
                        <img
                            src={this.state.responseImage}
                        />
                    </div>
                </div>}
            </div>
        )
    }
}


export default HomePage;
