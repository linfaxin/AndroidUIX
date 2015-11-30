/**
 * Created by linfaxin on 15/11/28.
 */
///<reference path="List.ts"/>
///<reference path="ArrayList.ts"/>

module java.util{

    export class Collections{

        private static EMPTY_LIST = new ArrayList();
        static emptyList():List<any> {
            return Collections.EMPTY_LIST;
        }
    }
}