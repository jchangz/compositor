export interface RouteData {
  slug: string;
  title: string;
  images: Array<ImageData>;
}

export interface ImageData {
  id: string;
  url: string;
  title: string;
  dbClipPath: Array<number>;
}

export interface ImagePropsData {
  top: number;
  right: number;
  bottom: number;
  left: number;
  height: number;
  width: number;
}
