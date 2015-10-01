export interface RouteInfo {
	routeNo: string;
	serviceType: string;
	origin: string;
	destination: string;
	journeyTime: number;
	stages:string[];
}

export interface RoutesBetweenStages {
	origin:string;
	destination:string;
	routeNos:string[];
}