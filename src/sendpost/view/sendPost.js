import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, Route} from "react-router-dom";
import {sendPost, updateImage,changeText,addLabel} from "../Actions";
import Cookie from 'js-cookie';
import './sendPost.css';

class SendPost extends Component {
    constructor() {
        super(...arguments);
        this.canvas = React.createRef();
        this.state = {
            fileType: '',
            img: '',
            devWidth: document.documentElement.clientWidth,
            show: 1,
            scale: 0,
            imgWidth: 0,
            imgHeight: 0,
            cropW: 0,
            cropH: 0,
            sx: 0,
            sy: 0,
            dx: 0,
            dy: 0,
            dw: 0,
            dh: 0,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
            ctx: '',
            size: -1

        };
        this.inputFile = this.inputFile.bind(this);
        this.changeShow = this.changeShow.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.changeText = this.changeText.bind(this);
    }

    changeText(e){
        this.props.changeText(e.target.value)
    }

    changeShow() {
        this.setState({show: this.state.show * -1})
    }

    changeSize() {
        const {ctx, img, sx, sy, cropW, cropH, devWidth, imgWidth, imgHeight, dx, dy, dw, dh, size} = this.state;
        console.log(size);
        this.setState({size: this.state.size * -1});
        if (size === 1) {
            this.draw(ctx, img, sx, sy, cropW, cropH, dx, dy, dw, dh)
        } else {
            let Height=cropH, Width=cropW,sy=0, sx2=sx, dx2=dx, dy2=dy, dw2=dw, dh2=dh;
            if (imgWidth > imgHeight) {
                let tempH = (devWidth / imgWidth) * imgHeight;
                if (tempH <= devWidth * 0.66) {
                    Height = imgHeight;
                    dh2 = devWidth * 0.66;
                    Width = Height / 0.66;
                    sx2 = (imgWidth / 2) - (Width / 2);
                    dy2 = (devWidth / 2) - (dh2 / 2);
                } else if (tempH > devWidth * 0.66) {
                    Width = imgWidth;
                    Height = imgHeight;
                    dh2 = tempH;
                    dy2 = (devWidth / 2) - (dh2 / 2);
                }
            } else if (imgWidth <= imgHeight) {
                let tempW = (devWidth / imgHeight) * imgWidth;
                if (tempW <= devWidth * 0.66) {
                    Width = imgWidth;
                    Height = Width / 0.66;
                    dw2 = devWidth * 0.66;
                    dx2 = (devWidth / 2) - (dw2 / 2);
                } else if (tempW > devWidth * 0.66) {
                    Width = imgWidth;
                    Height = imgHeight;
                    dw2 = tempW;
                    dx2 = (devWidth / 2) - (dw2 / 2);
                }
            }
            this.draw(ctx, img, sx2, sy, Width, Height, dx2, dy2, dw2, dh2)
        }

    }

    inputFile(e) {
        if (!e.target.files || e.target.files.length <= 0) {
            return
        }
        const file = e.target.files[0];
        if (file.type.split('/')[0] !== 'image') {
            alert('请上传图片');
            return;
        }
        let reader = new FileReader(file);
        reader.onload = (e) => {
            let Base64 = e.target.result;
            let img = new Image();
            img.src = Base64;


            img.onload = () => {
                const Width = img.width;
                const Height = img.height;
                const cvs = document.getElementById('cvs');
                cvs.width = this.state.devWidth;
                cvs.height = this.state.devWidth;
                let ctx = cvs.getContext('2d');
                this.setState({
                    img: img,
                    imgWidth: Width,
                    imgHeight: Height,
                    sx: 0,
                    sy: 0,
                    dx: 0,
                    dy: 0,
                    dw: this.state.devWidth,
                    dh: this.state.devWidth,
                    ctx: ctx
                });

                let imgWidth = Width, imgHeight = Height, sx = 0, sy = 0, dx = 0, dy = 0, dw = this.state.devWidth,
                    dh = this.state.devWidth;

                if (imgWidth > imgHeight) {
                    let temp = this.state.devWidth / Height;
                    sx = ((Width * temp / 2) - (this.state.devWidth / 2)) / temp;
                    this.setState({
                        sx: ((Width * temp / 2) - (this.state.devWidth / 2)) / temp,
                        cropW: imgHeight,
                        cropH: imgHeight,
                        scale: temp
                    });
                    imgWidth = imgHeight;
                } else if (imgWidth < imgHeight) {
                    let temp = this.state.devWidth / Width;
                    sy = ((Height * temp / 2) - (this.state.devWidth / 2)) / temp;
                    this.setState({
                        sy: ((Height * temp / 2) - (this.state.devWidth / 2)) / temp,
                        cropW: imgWidth,
                        cropH: imgWidth,
                        scale: temp
                    });
                    imgHeight = imgWidth
                }

                // ctx.clearRect(0, 0, this.state.devWidth, this.state.devWidth);
                // ctx.drawImage(img, sx, sy, imgWidth, imgHeight, dx, dy, dw, dh);
                this.draw(ctx, img, sx, sy, imgWidth, imgHeight, dx, dy, dw, dh);
            }
        };
        reader.readAsDataURL(file);
    }

    draw(ctx, img, sx, sy, cropW, cropH, dx, dy, dw, dh) {
        ctx.clearRect(0, 0, this.state.devWidth, this.state.devWidth);
        ctx.drawImage(img, sx, sy, cropW, cropH, dx, dy, dw, dh);
        this.props.updateImage(this.canvas.current.toDataURL('image'))
        // console.log([sx, sy, cropW, cropH, dx, dy, dw, dh])
    }

    render() {
        let updateImg = <div className='sendPost-upIMG'>
            <div className='sendPost-upIMG-box'>
                <canvas id='cvs' ref={this.canvas}></canvas>
            </div>
            <label style={this.state.show === 1 ? {display: 'block'} : {display: 'none'}}>
                <input onClick={this.changeShow} onChange={this.inputFile} className='input' type='file'
                       accept='image/jpeg,image/png'/>
                <span>选择图片</span>
            </label>
            <span style={this.state.imgHeight===this.state.imgWidth?{display:'none'}:{display:'block'}} onClick={this.changeSize} className='changeSize'></span>
        </div>

        let send = <div className='sendPost-sub'>
            <div className='box'>
                <textarea placeholder='添加说明' maxLength='320' required={true} style={{ width: `${(100-((300/2)/540)*100)}vw`}} onChange={this.changeText} autoFocus={true} value={this.props.text}></textarea>
                <img src={this.props.img}/>
            </div>
            <div className='label'>
                <span>风景</span>
                <span>fdsjklh</span>
            </div>
        </div>

        return (
            <div className='sendPost-page'>
                {this.props.sendStatus === 0 ? updateImg : send}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        text: state.sendPostReducer.text,
        label: state.sendPostReducer.label,
        sendStatus: state.sendPostReducer.sendStatus,
        img:state.sendPostReducer.img
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateImage: (img) => {
            dispatch(updateImage(img))
        },
        changeText:(text)=>{
            dispatch(changeText(text))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SendPost))