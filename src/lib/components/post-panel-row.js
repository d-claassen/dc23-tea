/**
 * Post panel row for usage in WordPress sidebar.
 *
 * Taken from @wordpress/block-editor, where its not ecposed. Thid does rely
 * on the css classes from that exact implementation.
 *
 * @param {Object}  props
 * @param {string}  props.className
 * @param {string}  props.label
 * @param {Element} props.childrem
 *
 * @return {Element} Row with label and content.
 */
export function PostPanelRow( { className, label, children } ) {
	return (
		<HStack className={ 'editor-post-panel__row ' + className }>
			{ label && (
				<div className="editor-post-panel__row-label">{ label }</div>
			) }
			<div className="editor-post-panel__row-control">{ children }</div>
		</HStack>
	);
}
