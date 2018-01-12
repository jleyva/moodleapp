// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { CoreTextUtilsProvider } from '../../../../providers/utils/text';
import { CoreCourseProvider } from '../../providers/course';
import { CoreCourseModuleDelegate } from '../../providers/module-delegate';

/**
 * Page that displays info about an unsupported module.
 */
@IonicPage({segment: 'core-course-unsupported-module'})
@Component({
    selector: 'page-core-course-unsupported-module',
    templateUrl: 'unsupported-module.html',
})
export class CoreCourseUnsupportedModulePage {

    module: any;
    isDisabledInSite: boolean;
    isSupportedByTheApp: boolean;
    moduleName: string;

    constructor(navParams: NavParams, private translate: TranslateService, private textUtils: CoreTextUtilsProvider,
            private moduleDelegate: CoreCourseModuleDelegate, private courseProvider: CoreCourseProvider) {
        this.module = navParams.get('module') || {};
    }

    /**
     * View loaded.
     */
    ionViewDidLoad() {
        this.isDisabledInSite = this.moduleDelegate.isModuleDisabledInSite(this.module.modname);
        this.isSupportedByTheApp = this.moduleDelegate.hasHandler(this.module.modname);
        this.moduleName = this.courseProvider.translateModuleName(this.module.modname);
    }

    /**
     * Expand the description.
     */
    expandDescription() {
        this.textUtils.expandText(this.translate.instant('core.description'), this.module.description, false);
    }
}