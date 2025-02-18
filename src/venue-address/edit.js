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
	const { address, city, country, region, zip } = useSelect(
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
			const {
				_VenueAddress,
				_VenueCity,
				_VenueCountry,
				_VenueStateProvince,
				_VenueZip,
			} = venue?.meta || {};

			return {
				address: _VenueAddress,
				city: _VenueCity,
				country: _VenueCountry,
				region: _VenueStateProvince,
				zip: _VenueZip,
			};
		},
		[ postId ]
	);

	return (
		<address { ...useBlockProps() }>
			{ address && (
				<>
					{ address }
					<br />
				</>
			) }

			{ city && <>{ city }, </> }

			{ region && <>{ region } </> }

			{ zip && <>{ zip } </> }

			{ country && (
				<>
					<br />
					{ country }
				</>
			) }
		</address>
	);
}
function Placeholder() {
	return (
		<address { ...useBlockProps() }>
			Address
			<br />
			City, region zip
			<br />
			Country
		</address>
	);
}

export default function Edit( { context } ) {
	const { postType, postId } = context;

	return (
		<>
			{ postId && postType === 'tribe_events' ? (
				<Content context={ context } />
			) : (
				<Placeholder />
			) }
		</>
	);
}
