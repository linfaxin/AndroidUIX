/**
 * Created by linfaxin on 15/11/6.
 */
module androidui.util{
    export class ClassFinder {
        /**
         * @param classFullName com.xxx.xxx.MyView
         * @param findInRoot root obj to find
         */
        static findClass(classFullName:string, findInRoot:any=window) {
            let nameParts = classFullName.split('.');

            let finding:any = findInRoot;
            for(let part of nameParts){
                //try ignore case first
                let quickFind = finding[part.toLowerCase()];
                if(quickFind){
                    finding = quickFind;
                    continue;
                }

                //search
                let found = false;
                for(let key in finding){
                    if(key.toUpperCase()===part.toUpperCase()){
                        finding = finding[key];
                        found = true;
                        break;
                    }
                }
                if(!found) return null;
            }

            if(finding === findInRoot){
                return null;
            }
            return finding;
        }

        static _findViewClassCache = {};
        static findViewClass(className:string) {
            let rootViewClass = ClassFinder._findViewClassCache[className];
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className, android.view);
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className, android['widget']);
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className, androidui['widget']);
            if(!rootViewClass) rootViewClass = ClassFinder.findClass(className);
            if(!rootViewClass){
                if(document.createElement(className) instanceof HTMLUnknownElement){
                    console.warn('inflate: not find class ' + className);
                }
                return null;
            }
            ClassFinder._findViewClassCache[className] = rootViewClass;
            return rootViewClass;
        }
    }
}