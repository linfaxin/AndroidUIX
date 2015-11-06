/**
 * Created by linfaxin on 15/11/6.
 */
module runtime.util{
    export class ClassFinder{
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
    }
}