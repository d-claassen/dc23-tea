/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
const { useSelect } = require( '@wordpress/data' );

/**
 * Internal dependencies.
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props
 * @param {Object} props.context
 * @param {number} props.context.postId
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
function Content( { context: { postId } } ) {
	const { address, city, country } = useSelect(
		( select ) => {
			const { getEntityRecord, getEditedEntityRecord } = select( 'core' );

			const event = getEditedEntityRecord(
				'postType',
				'tribe_events',
				postId
			);
			const { _EventVenueID } = event?.meta;

			const venue = getEntityRecord(
				'postType',
				'tribe_venue',
				_EventVenueID
			);
			const { _VenueAddress, _VenueCity, _VenueCountry } = venue?.meta || {};

			return {
				adress: _VenueAddress,
				city: _VenueCity,
				country: _VenueCountry,
			};
		},
		[ postId ]
	);

	return (
		<address { ...useBlockProps() }>
			{ address && (
				<>
					{ address }
					<br/>
				</>
			) }

			{ city && (
				<>
					{ city },
				</>
			) }

			{ country && (
				<>
					{ country }
					<br/>
				</>
			) }
		</address>
	);
}
function Placeholder() {
	return (
		<address { ...useBlockProps() }>
			Address<br/>
			City, country<br/>
		</address>
	);
}

export default function Edit( { context } ) {
	const { postType, postId } = context;

	if ( postType !== 'tribe_events' ) {
		return null;
	}

	return (
		<>
			{ postId && postType ? (
				<Content context={ context } />
			) : (
				<Placeholder />
			) }
		</>
	);
}