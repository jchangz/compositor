export interface ImageData {
  id: string;
  url: string;
  title: string;
  dbClipPath: Array<number>;
}

export type ImageDataArray = Array<ImageData>;

export interface RouteData {
  slug: string;
  title: string;
  images: ImageDataArray;
}

export interface ImagePropsData {
  top: number;
  right: number;
  bottom: number;
  left: number;
  height: number;
  width: number;
}
