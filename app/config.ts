var sitoolsBaseUrl = "http://demonstrator.telespazio.com/sitools";
var isMobile = ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch));

export interface ExternalService {
	baseUrl: string
}

// TODO: replace all "any's" to an interface
export interface Config {
	sitoolsBaseUrl : string,
	"continuousRendering" : boolean,
	"coordSystem" : string,
	"debug" : boolean,
	"nameResolver" : any,
	"reverseNameResolver" : ExternalService,
	"coverageService": ExternalService,
	"solarObjects": ExternalService,
	"votable2geojson": ExternalService,
	"cutOut": ExternalService,
	"zScale": ExternalService,
	"healpixcut": ExternalService,
	"shortener": ExternalService,
	"navigation" : any,
	"stats": any
	"positionTracker": any,
	"isMobile" : boolean
}

export const CONFIG:Config = {
	"sitoolsBaseUrl" : sitoolsBaseUrl,
	"continuousRendering" : !isMobile,
	"coordSystem" : "EQ",
	"debug" : false,
	"nameResolver" : {
		"baseUrl" : sitoolsBaseUrl + '/project/mizar/plugin/nameResolver',
		"zoomFov": 15,
		"duration": 3000
	},
	"reverseNameResolver" : {
		"baseUrl" : sitoolsBaseUrl + '/project/mizar/plugin/reverseNameResolver',
	},
	"coverageService": {
		"baseUrl": sitoolsBaseUrl + "/project/mizar/plugin/coverage?moc="
	},
	"solarObjects": {
		"baseUrl": sitoolsBaseUrl + "/project/mizar/plugin/solarObjects/"
	},
	"votable2geojson": {
		"baseUrl": sitoolsBaseUrl + "/project/mizar/plugin/votable2geojson"
	},
	"cutOut": {
		"baseUrl": sitoolsBaseUrl + "/cutout"
	},
	"zScale": {
		"baseUrl": sitoolsBaseUrl + "/zscale"
	},
	"healpixcut": {
		"baseUrl": sitoolsBaseUrl + "/healpixcut"
	},
	"shortener": {
		"baseUrl": sitoolsBaseUrl + "/shortener"
	},
	"navigation" : {
		"initTarget": [85.2500, -2.4608],
		"initFov": 20,
		"inertia": true,
		"minFov": 0.001,
		"zoomFactor": 0
	},
	"stats": {
		"verbose": false,
		"visible": false
	},
	"positionTracker": {
		"position": "bottom"
	},
	"isMobile" : isMobile
};