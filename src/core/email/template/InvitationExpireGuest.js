import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'


class InvitationExpireGuest extends Component {
	static propTypes = {
		content: PropTypes.shape({
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.object.isRequired,
      checkOut: PropTypes.object.isRequired,
			hostName: PropTypes.string.isRequired,
			hostProfilePic: PropTypes.string.isRequired,
			threadId: PropTypes.number.isRequired,
			listId: PropTypes.number.isRequired,
		}).isRequired
	};

	render() {
		const textStyle = {
			color: '#484848',
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px',
		};

		const profilePic = {
			borderRadius: '999px',
			margin: '0',
			padding: '0',
			lineHeight: '150%',
			borderSpacing: '0',
			width: '125px'
		};

		const userName = {
			color: '#565a5c',
			fontSize: '26px',
			fontWeight: 'bold',
			paddingBottom: '5px',
		}

		const centerText = {
			textAlign: 'center'
		}

		const tagStyle = {
			color: '#0074c2',
		}

		const btnCenter = {
			textAlign: 'center'
		}
		const buttonStyle = {
			margin: 0,
			fontFamily: 'Arial',
			padding: '10px 16px',
			textDecoration: 'none',
			borderRadius: '2px',
			border: '1px solid',
			textAlign: 'center',
			verticalAlign: 'middle',
			fontWeight: 'bold',
			fontSize: '18px',
			whiteSpace: 'nowrap',
			background: '#ffffff',
			borderColor: '#5DAD41',
			backgroundColor: '#5DAD41',
			color: '#ffffff',
			borderTopWidth: '1px',

		}


		const { content: { guestName, listTitle, listTimeZone, checkIn, checkOut, threadId } } = this.props;
		const { content: { hostName, hostProfilePic, listId } } = this.props;
		const checkInDate = (checkIn && listTimeZone) ? moment(checkIn).tz(listTimeZone).format('ll') : '';
		const checkOutDate = (checkOut && listTimeZone) ? moment(checkOut).tz(listTimeZone).format('ll') : '';
		let imageURL;
		let messageURL = url + '/rooms/'+ listId;
		if (hostProfilePic) {
			imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic;
		}

		return (
			<Layout>
				{/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
				<div>
					<Table width="100%" >
						<TBody>
							<TR>
								<TD style={textStyle}>
									<EmptySpace height={20} />
									<div>
										Hi {guestName}!
					        		</div>
									<EmptySpace height={20} />
									<div>
                  We’re sorry to say that {hostName}’s invitation to book {listTitle} from  {checkInDate} - {checkOutDate} has expired. You had 24 hours to complete the booking in order to secure this accommodation for these dates.
					        </div>
									<EmptySpace height={20} />
									<div>
                  If you still want to book this trip, no worries - just send a booking request! Once {hostName} approves it, you’ll be notified when your 24 hours starts to complete your booking 😊.
									</div>
									<EmptySpace height={20} />
									<div style={btnCenter}>
										<a href={messageURL} style={buttonStyle}>Send Booking Request </a>
									</div>
									
									<EmptySpace height={20} />
									<div>
                  As always, reply to this email if you need any help. We’re here for you!
									</div>
									<EmptySpace height={40} />
									<div>
										Thanks! <br />
										The {sitename} Team
					        		</div>
								</TD>
							</TR>
						</TBody>
					</Table>
					<EmptySpace height={40} />
				</div>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default InvitationExpireGuest;
