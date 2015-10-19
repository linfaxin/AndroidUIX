/**
 * Created by linfaxin on 15/10/18.
 */
///<reference path="Rect.ts"/>

module android.graphics{
    //TODO impl
    export class Matrix{
        static IDENTITY_MATRIX = new Matrix();

        isIdentity():boolean{
            return true;
        }

        mapRect(boundingRect:Rect):boolean {
            return false;
        }
    }
}