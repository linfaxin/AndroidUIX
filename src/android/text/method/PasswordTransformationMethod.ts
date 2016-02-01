/**
 * Created by linfaxin on 16/2/2.
 */
///<reference path="SingleLineTransformationMethod.ts"/>

module android.text.method {
    export class PasswordTransformationMethod extends SingleLineTransformationMethod {
        private static instance:PasswordTransformationMethod;

        getTransformation(source:String, v:android.view.View):String {
            let transform = super.getTransformation(source, v);
            if(transform) transform = new Array(transform.length+1).join('•');
            return transform;
        }

        static getInstance():PasswordTransformationMethod  {
            if (PasswordTransformationMethod.instance != null) return PasswordTransformationMethod.instance;
            PasswordTransformationMethod.instance = new PasswordTransformationMethod();
            return PasswordTransformationMethod.instance;
        }
    }
}