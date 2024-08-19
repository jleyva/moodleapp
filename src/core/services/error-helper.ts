// (C) Copyright 2015 Moodle Pty Ltd.
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

import { Injectable } from '@angular/core';
import { CoreAnyError, CoreError } from '@classes/errors/error';
import { makeSingleton, Translate } from '@singletons';
import { AlertButton } from '@ionic/angular';

/**
 * Provider to provide some helper functions regarding files and packages.
 */
@Injectable({ providedIn: 'root' })
export class CoreErrorHelperService {

    /**
     * Add some text to an error message.
     *
     * @param error Error message or object.
     * @param text Text to add.
     * @returns Modified error.
     */
    addTextToError(error: string | CoreError | CoreErrorObject | undefined | null, text: string): string | CoreErrorObject {
        if (typeof error === 'string') {
            return error + text;
        }

        if (error instanceof CoreError) {
            error.message += text;

            return error;
        }

        if (!error) {
            return text;
        }

        if (typeof error.message === 'string') {
            error.message += text;
        } else if (typeof error.error === 'string') {
            error.error += text;
        } else if (typeof error.content === 'string') {
            error.content += text;
        } else if (typeof error.body === 'string') {
            error.body += text;
        }

        return error;
    }

    /**
     * Add some title to an error message.
     *
     * @param error Error message or object.
     * @param title Title to add.
     * @returns Modified error.
     */
    addTitleToError(error: string | CoreError | CoreErrorObject | undefined | null, title: string): CoreErrorObject {
        let improvedError: CoreErrorObject = {};

        if (typeof error === 'string') {
            improvedError.message = error;
        } else if (error && 'message' in error) {
            improvedError = error;
        }

        improvedError.title = improvedError.title || title;

        return improvedError;
    }

    /**
     * Build a message with several paragraphs.
     *
     * @param paragraphs List of paragraphs.
     * @returns Built message.
     */
    buildSeveralParagraphsMessage(paragraphs: (string | CoreErrorObject)[]): string {
        // Filter invalid messages, and convert them to messages in case they're errors.
        const messages: string[] = [];

        paragraphs.forEach(paragraph => {
            // If it's an error, get its message.
            const message = this.getErrorMessageFromError(paragraph);

            if (paragraph && message) {
                messages.push(message);
            }
        });

        if (messages.length < 2) {
            return messages[0] || '';
        }

        let builtMessage = messages[0];

        for (let i = 1; i < messages.length; i++) {
            builtMessage = Translate.instant('core.twoparagraphs', { p1: builtMessage, p2: messages[i] });
        }

        return builtMessage;
    }

    /**
     * Get the error message from an error object.
     *
     * @param error Error.
     * @returns Error message, undefined if not found.
     */
    getErrorMessageFromError(error?: CoreAnyError): string | undefined {
        if (typeof error === 'string') {
            return error;
        }

        if (error instanceof CoreError) {
            return error.message;
        }

        if (!error) {
            return undefined;
        }

        if (error.message || error.error || error.content) {
            return error.message || error.error || error.content;
        }

        if (error.body) {
            return this.getErrorMessageFromHTML(error.body);
        }

        return undefined;
    }

    /**
     * Get the error message from an HTML error page.
     *
     * @param body HTML content.
     * @returns Error message or empty string if not found.
     */
    getErrorMessageFromHTML(body: string): string {
        // THe parser does not throw errors and scripts are not executed.
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, 'text/html');

        // Errors are rendered using the "errorbox" and "errormessage" classes since Moodle 2.0.
        const element = doc.body.querySelector<HTMLElement>('.errorbox .errormessage');

        return element?.innerText.trim() ?? '';
    }

}
export const CoreErrorHelper = makeSingleton(CoreErrorHelperService);

/**
 * Different type of errors the app can treat.
 */
export type CoreErrorObject = {
    message?: string;
    error?: string;
    content?: string;
    body?: string;
    debuginfo?: string;
    backtrace?: string;
    title?: string;
    buttons?: AlertButton[];
};