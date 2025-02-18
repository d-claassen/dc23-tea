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
	const { url } = useSelect(
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
			const { _VenueURL } = venue?.meta || {};

			return {
				url: _VenueURL,
			};
		},
		[ postId ]
	);

	return (
		<div { ...useBlockProps() }>
			<a href={ url }>{ url }</a>
		</div>
	);
}
function Placeholder() {
	return (
		<div { ...useBlockProps() }>
			<a href="https://example.org">Venue URL</a>
		</div>
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
