/*
 * Copyright (C) 2008 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../android/widget/Adapter.ts"/>
///<reference path="../../android/widget/ListAdapter.ts"/>
///<reference path="../../android/widget/ListView.ts"/>

module android.widget {
import Adapter = android.widget.Adapter;
import ListAdapter = android.widget.ListAdapter;
import ListView = android.widget.ListView;
/**
 * List adapter that wraps another list adapter. The wrapped adapter can be retrieved
 * by calling {@link #getWrappedAdapter()}.
 *
 * @see ListView
 */
export interface WrapperListAdapter extends ListAdapter {

    /**
     * Returns the adapter wrapped by this list adapter.
     *
     * @return The {@link android.widget.ListAdapter} wrapped by this adapter.
     */
    getWrappedAdapter():ListAdapter ;
}
}