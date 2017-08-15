
type position = 'absolute' | 'fixed';
type overflow = 'auto' | 'initial';

let posFixed: position = 'fixed';
let overflowAuto: overflow = 'auto';

export const imageStyle = {
    seriesStyle: {
        // maxWidth: '20%',
        // maxHeight: '15%',
        // borderStyle: 'solid'
    },
    contentCenter: {
        wordWrap: 'break-word',
    },
    img: {
        maxWidth: '100%',
        maxHeight: '100%',
        align: 'middle',
        display: 'block',
        margin: 'auto',
        // padding: '2px'
    },
    iconButtonStyle: {
        position: 'absolute',
        right: '-25px',
        top: '-25px'
    },
    blowUpDiv: {
        padding: 5,
        textAlign: 'center',
        display: 'inline-block',
        position: 'relative',
        margin: '15px'
    },
    wrapper: {
        textAlign: 'center',
        display: 'block'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    backgroundDiv: {
        position: posFixed,
        top: 0,
        left: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 5,
        width: '75%',
        height: '100%',
        display: 'none',
        paddingTop: '70px',
        overflow: overflowAuto
    },

    imageViewerDiv: {
        marginLeft: '10',
        marginBottom: '10',
        marginRight: '10'
    },

    imageViewerPaper: {
        paddingLeft: '16',
        paddingRight: '16',
        paddingTop: '16',
        paddingBottom: '30'
    },

    imageViewerCard: {
        // paddingLeft: '3', 
        // paddingRight: '3', 
        // paddingTop: '3', 
        // paddingBottom: '10'
        // padding: 10 
    },
    ImageViewGrid: {
        marginTop: '28',
    }

};


export const downloadStyle = {
    appBar: {
        width: '500px',
        position: 'inherit'
    },
    flex:{
        flex: 1
    },
    paddingDisable: {
        paddingLeft: '0px',
        paddingRight: '0px'
    }
}