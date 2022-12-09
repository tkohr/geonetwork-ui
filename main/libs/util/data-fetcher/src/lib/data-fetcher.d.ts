import type { Feature } from 'geojson';
import { DatasetHeaders } from './headers';
import { SupportedType } from '../mime/types';
export declare type DataItem = Feature;
/**
 * This fetches the full dataset at the given URL and parses it according to its mime type.
 * All items in the dataset are converted to GeoJSON features, even if they do not bear any spatial geometry.
 * File type can be either inferred (from the HTTP headers or the URL), or hinted using the 2nd argument
 * File type is determined liked so:
 *  1. if a type hint is given, use it
 *  2. otherwise, look for a Content-Type header in the response with a supported mime type
 *  3. if no valid mime type was found, look for an explicit file extension in the url (.csv, .geojson etc.)
 */
export declare function readDataset(url: string, typeHint?: SupportedType): Promise<DataItem[]>;
/**
 * This fetches only the header of the dataset at the given URL, giving info on size, mime-type and last update if available.
 */
export declare function readDatasetHeaders(url: string): Promise<DatasetHeaders>;
