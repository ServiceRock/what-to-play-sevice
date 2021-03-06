import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { inject } from '@ember/service';
import config from '../config/environment';
export default ToriiAuthenticator.extend({
	torii: inject(),
	ajax: inject(),

	authenticate() {
		const ajax = this.get('ajax');
		const tokenExchangeUri = config.torii.providers['google-oauth2'].tokenExchangeUri;

		return this._super(...arguments).then((data) => {
			return ajax
				.request(tokenExchangeUri, {
					type: 'GET',
					crossDomain: true,
					dataType: 'json',
					contentType: 'application/json',
					data: {
						code: data.authorizationCode
					}
				})
				.then((response) => {
					return {
						access_token: response.access_token,
						provider: data.provider
					};
				});
		});
	}
});
