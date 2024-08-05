import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"


document.addEventListener("DOMContentLoaded", function () {

    //// CSS variables start
    const rootStyles = getComputedStyle(document.documentElement);

    const lineColor = rootStyles.getPropertyValue('--secondary-clr').trim();
    const hasPopupColor = rootStyles.getPropertyValue('--tertiary-clr-3').trim();
    const nodeHoverColor = rootStyles.getPropertyValue('--tree-hover-clr-1').trim();
    const nodeHoverAltColor = rootStyles.getPropertyValue('--tree-hover-alt-clr-1').trim();
    const romanticRelationColor = rootStyles.getPropertyValue('--tree-romantic-relation').trim();
    const backgroundColor = '#fff';
    const mainStrokeWidth = '2px';
    const mainDashArray = '4,4';
    const directAncestorWidth = '3px';
    // CSS variables end

    let isTransitioning = false;

    const width = document.getElementById('fam-tree').clientWidth;
    const height = document.getElementById('fam-tree').clientHeight;

    // Define the tree layout and node size for dense sibling spacing **To change vertical/horizontal spacing, check "nodes.forEach"**
    const treeLayout = d3.tree().size([height, width - 160]).nodeSize([120, 160]);

    let root = d3.hierarchy(window.familyTree);
    root.x0 = height / 2;
    root.y0 = 0;

    // Make the number of nodes available to other pages, e.g. front page
    let nodeCount = root.descendants().length;// Count the nodes
    localStorage.setItem('nodeCount', nodeCount); // Store the node count in localStorage

    const svg = d3.select("#fam-tree")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(500,40)");

    //////////////////////// ADD ZOOM TO NODE WHEN COLLAPSING

    // Variables for trackpad detection
    let isTrackpad = false;
    let detectionLock = false;
    let lastDetectionTime = 0;
    let lastDeltaY = 0;
    const lockDuration = 500;
    let firstScrollDetectionMade = false;

    // Trackpad detection function
    function detectTrackPad(e) {
        var now = Date.now();
        if (detectionLock && (now - lastDetectionTime) < lockDuration) {
            return;
        }

        var deltaYDifference = Math.abs(e.deltaY) - Math.abs(lastDeltaY);
        lastDeltaY = e.deltaY;

        if (e.wheelDeltaY) {
            isTrackpad = Math.abs(e.wheelDeltaY) !== 120;
        } else if (e.deltaMode === 0) {
            isTrackpad = true;
        } else {
            isTrackpad = false;
        }

        if (Math.abs(deltaYDifference) > 0) {
            isTrackpad = true;
        }

        detectionLock = true;
        lastDetectionTime = now;
        setTimeout(() => {
            detectionLock = false;
        }, lockDuration);

        if (!firstScrollDetectionMade) {
            isTrackpad = false;
            firstScrollDetectionMade = true;
        }
    }

    // Define the zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed)
        .filter(event => {
            detectTrackPad(event);
            return !event.ctrlKey && !event.button;
        });

    // Apply zoom behavior to the SVG
    d3.select("#fam-tree").select("svg")
        .call(zoom)
        .on("dblclick.zoom", null);

    // Zoomed function with conditional smooth transition
    function zoomed(event) {
        if (!isTrackpad) {
            // Smooth transition for mouse wheel
            svg.transition()
                .duration(250)  // Reduced duration for faster zooming
                .ease(d3.easeQuadOut)
                .attr("transform", event.transform);
        } else {
            // Immediate update for trackpad or other inputs
            svg.attr("transform", event.transform);
        }
    }

    // Initial zoom transform
    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 4).scale(1);
    d3.select("#fam-tree").select("svg")
        .call(zoom.transform, initialTransform);


    // Function to smoothly pan/move to a specific node
    function panToNode(d) {
        // Use the node's own coordinates instead of its bounds
        const x = d.x;
        const y = d.y;

        // Check for NaN or Infinity values
        if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
            console.warn("Invalid coordinates detected. Skipping pan.");
            return;
        }

        // Get the current dimensions of the container
        const width = document.getElementById('fam-tree').clientWidth;
        const height = document.getElementById('fam-tree').clientHeight;

        // Get the current zoom transform
        const currentTransform = d3.zoomTransform(d3.select("#fam-tree").select("svg").node());

        // Calculate new translate values while maintaining the current scale
        const translate = [
            width / 2 - x * currentTransform.k,
            height / 2 - y * currentTransform.k
        ];

        // Check for NaN or Infinity values in the final transform
        if (isNaN(translate[0]) || isNaN(translate[1]) || !isFinite(translate[0]) || !isFinite(translate[1])) {
            console.warn("Invalid transform values detected. Skipping pan.");
            return;
        }

        d3.select("#fam-tree").select("svg").transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(currentTransform.k));
    }


    // Helper function to get node bounds (if needed)
    function getBounds(d) {
        let left = d.x;
        let right = d.x;
        let top = d.y;
        let bottom = d.y;
        if (d.children) {
            d.children.forEach(function (child) {
                const childBounds = getBounds(child);
                if (childBounds[0][0] < left) left = childBounds[0][0];
                if (childBounds[1][0] > right) right = childBounds[1][0];
                if (childBounds[0][1] < top) top = childBounds[0][1];
                if (childBounds[1][1] > bottom) bottom = childBounds[1][1];
            });
        }
        return [[left, top], [right, bottom]];
    }


    // Add a div for the popup
    const popupDiv = d3.select("#fam-tree").append("div")
        .attr("class", "fam-tree__popup");

    // Function to sanitize and assign unique IDs to nodes
    const nameCounts = {};
    function sanitizeName(name, prefix = '') {
        // Convert to lowercase, replace spaces with dashes, and remove special characters
        const dashedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const finalName = prefix ? `${prefix}${dashedName}` : dashedName;
        if (!nameCounts[finalName]) {
            nameCounts[finalName] = 0;
        }
        nameCounts[finalName]++;
        return nameCounts[finalName] === 1 ? finalName : `${finalName}-${nameCounts[finalName]}`;
    }

    // Add IDs to nodes with empty node prefix if applicable
    root.descendants().forEach(d => {
        const prefix = d.data.emptyNode ? 'empty-' : '';
        d.data.id = sanitizeName(d.data.name, prefix);
    });

    // Helper function to check if any ancestors of a node are collapsed
    function isAncestorCollapsed(node) {
        if (!node.parent) return false; // root node
        if (node.parent._children) return true;
        return isAncestorCollapsed(node.parent);
    }

    // Function to create path data for connection lines
    function createPathData(sourceNode, targetNode, direction, xOffset, yOffset) {
        let pathData;
        const sourceX = sourceNode.x + xOffset;
        const sourceY = sourceNode.y + yOffset;
        const targetX = targetNode.x + xOffset;
        const targetY = targetNode.y + yOffset;
        const horizontalCurveOffset = 10;
        const verticalCurveOffset = 10;

        if (direction === 'horizontalToVertical') {
            if (sourceX < targetX) {
                // Left to right
                pathData = `M${sourceX},${sourceY}
                        H${targetX - horizontalCurveOffset}
                        Q${targetX},${sourceY} ${targetX},${sourceY + Math.sign(targetY - sourceY) * verticalCurveOffset}
                        V${targetY}`;
            } else {
                // Right to left
                pathData = `M${sourceX},${sourceY}
                        H${targetX + horizontalCurveOffset}
                        Q${targetX},${sourceY} ${targetX},${sourceY + Math.sign(targetY - sourceY) * verticalCurveOffset}
                        V${targetY}`;
            }
        } else { // direction is verticalToHorizontal
            if (sourceY < targetY) {
                // Top to bottom
                pathData = `M${sourceX},${sourceY}
                        V${targetY - verticalCurveOffset}
                        Q${sourceX},${targetY} ${sourceX + Math.sign(targetX - sourceX) * horizontalCurveOffset},${targetY}
                        H${targetX}`;
            } else {
                // Bottom to top
                pathData = `M${sourceX},${sourceY}
                        V${targetY + verticalCurveOffset}
                        Q${sourceX},${targetY} ${sourceX + Math.sign(targetX - sourceX) * horizontalCurveOffset},${targetY}
                        H${targetX}`;
            }
        }

        return pathData;
    }


    // Function to draw connection lines
    function drawConnectionLine(sourceId, targetId, style, direction = 'verticalToHorizontal', xOffset = 0, yOffset = 0) {
        const sourceNode = svg.select(`#${sourceId}`).datum();
        const targetNode = svg.select(`#${targetId}`).datum();

        // Check if either node or any of its ancestors is collapsed
        if (isAncestorCollapsed(sourceNode) || isAncestorCollapsed(targetNode)) {
            return;
        }

        const pathData = createPathData(sourceNode, targetNode, direction, xOffset, yOffset);

        svg.append('path')
            .attr('d', pathData)
            .attr('class', 'connection-line')
            .style('stroke', style.stroke || 'black')
            .style('stroke-width', style.strokeWidth || mainStrokeWidth)
            .style('fill', 'none')
            .style('stroke-dasharray', style.strokeDasharray || '0')
            .transition()
            .duration(200)
            .attr('d', pathData);  // Transition the path data
    }

    function updateConnectionLines() {
        const connections = [
            // Add connection lines here. 
            // IDs are assigned to each name based on the English name. If there are duplicates of names, a number is added e.g. adam-2

            // Property of "empty: true" can be added to make the connection lines more correct or easier to read, especially in the case of Jochebed and Levi, but this isn't refined yet, as when collapsing Kohath, Jochebed is hidden, while she should be visible as a child of Levi.

            /// Turns out some connection lines are just messy, but here they are just in case.
            // { sourceId: 'jochebed', targetId: 'levi', style: { stroke: lineColor, strokeWidth: mainStrokeWidth, strokeDasharray: '4,2' }, direction: 'horizontalToVertical', xOffset: -10, yOffset: 0 },
            // { sourceId: 'sarah', targetId: 'terah', style: { stroke: lineColor, strokeWidth: mainStrokeWidth, strokeDasharray: '4,2' }, direction: 'verticalToHorizontal', xOffset: -10, yOffset: 0 },
            // { sourceId: 'mahalathbasemath', targetId: 'ishmael', style: { stroke: lineColor, strokeWidth: mainStrokeWidth, strokeDasharray: '4,2' }, direction: 'verticalToHorizontal', xOffset: -10, yOffset: 0 },
            { sourceId: 'mary', targetId: 'joseph-3', style: { stroke: romanticRelationColor, strokeWidth: directAncestorWidth, strokeDasharray: '4,0' }, direction: 'horizontalToVertical', xOffset: 0, yOffset: 0 },
            { sourceId: 'michal', targetId: 'david', style: { stroke: romanticRelationColor, strokeWidth: mainStrokeWidth, strokeDasharray: mainDashArray }, direction: 'verticalToHorizontal', xOffset: -10, yOffset: 0 },
            { sourceId: 'moab', targetId: 'lot', style: { stroke: lineColor, strokeWidth: mainStrokeWidth, strokeDasharray: mainDashArray }, direction: 'horizontalToVertical', xOffset: -10, yOffset: 0 },
            { sourceId: 'ben-ammi', targetId: 'lot', style: { stroke: lineColor, strokeWidth: mainStrokeWidth, strokeDasharray: mainDashArray }, direction: 'horizontalToVertical', xOffset: 10, yOffset: 0 },
        ];

        const connectionLines = svg.selectAll('path.connection-line').data(connections, d => `${d.sourceId}-${d.targetId}`);

        // Remove old connection lines
        connectionLines.exit().transition().duration(200).remove();

        // Draw new and update existing connection lines with transition
        connectionLines.enter().insert('path', ':first-child') // Insert lines before the first child
            .attr('class', 'connection-line')
            .attr('d', d => {
                const sourceNodeSelection = svg.select(`#${d.sourceId}`);
                const targetNodeSelection = svg.select(`#${d.targetId}`);

                if (sourceNodeSelection.empty() || targetNodeSelection.empty()) return '';

                const sourceNode = sourceNodeSelection.datum();
                const targetNode = targetNodeSelection.datum();

                if (!sourceNode || !targetNode || isAncestorCollapsed(sourceNode) || isAncestorCollapsed(targetNode)) return '';

                return createPathData(sourceNode, targetNode, d.direction, d.xOffset, d.yOffset);
            })
            .style('stroke', d => d.style.stroke || 'black')
            .style('stroke-width', d => d.style.strokeWidth || mainStrokeWidth)
            .style('fill', 'none')
            .style('stroke-dasharray', d => d.style.strokeDasharray || '0')
            .merge(connectionLines)
            .transition()
            .duration(200)
            .attr('d', d => {
                const sourceNodeSelection = svg.select(`#${d.sourceId}`);
                const targetNodeSelection = svg.select(`#${d.targetId}`);

                if (sourceNodeSelection.empty() || targetNodeSelection.empty()) return '';

                const sourceNode = sourceNodeSelection.datum();
                const targetNode = targetNodeSelection.datum();

                if (!sourceNode || !targetNode || isAncestorCollapsed(sourceNode) || isAncestorCollapsed(targetNode)) return '';

                return createPathData(sourceNode, targetNode, d.direction, d.xOffset, d.yOffset);
            });
    }




    function update(source) {
        const treeData = treeLayout(root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        nodes.forEach(d => {
            d.y = d.depth * 100; // Adjust vertical spacing
            d.x = d.x * 1; // Spread out horizontally
        });

        const node = svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i));

        // Add class 'empty-node' to nodes with emptyNode: true
        const nodeEnter = node.enter().append('g')
            .attr('class', d => (d.data.emptyNode === true ? 'node empty-node' : (d.data.importantChar ? 'node important-char' : 'node')))
            .attr('transform', d => `translate(${source.x0},${source.y0}) scale(0)`)
            .attr('id', d => d.data.id)
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('touchend', touchend);

        nodeEnter.transition()
            .duration(200)
            .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
            .on('end', () => {
                isTransitioning = false; // Reset the transition flag when transition ends
            });

        // Conditionally append the rectangle if the node is not empty
        nodeEnter.filter(d => d.data.emptyNode !== true).append('rect')
            .attr('class', 'node-rect')
            .attr('rx', 10)
            .attr('ry', 10)
            .style('fill', function (d) {
                if (d3.select(this.parentNode).classed('hovered')) {
                    return nodeHoverColor;
                } else if (d.data.popup) {
                    return hasPopupColor; // Color for popup items
                }
                return backgroundColor; // Default color
            })
            .attr('cursor', 'pointer')
            .style('stroke', lineColor)
            .style('stroke-width', '1.5px');

        nodeEnter.append('text')
            .attr('class', 'node-name')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(d => d.data.name);

        nodeEnter.append('text')
            .attr('class', 'node-descriptor')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .style('fill', 'gray')
            .text(d => d.data.descriptor || '');

        nodeEnter.each(function (d) {
            if (d.data.emptyNode !== true) {
                const nameText = d3.select(this).select('.node-name');
                const descriptorText = d3.select(this).select('.node-descriptor');

                const nameBBox = nameText.node().getBBox();
                const descriptorBBox = descriptorText.node().getBBox();

                const paddingInline = d.data.importantChar ? 40 : 25; // Adjust padding based on importantChar
                const paddingBlock = d.data.importantChar ? 25 : 17;
                const boxWidth = Math.max(nameBBox.width, descriptorBBox.width) + paddingInline; // Add padding
                const boxHeight = nameBBox.height + (d.data.descriptor ? descriptorBBox.height + 5 : 0) + paddingBlock; // Add padding

                d3.select(this).select('.node-rect')
                    .attr('width', boxWidth)
                    .attr('height', boxHeight)
                    .attr('x', -boxWidth / 2)
                    .attr('y', -boxHeight / 2);

                if (d.data.descriptor) {
                    nameText.attr('y', -descriptorBBox.height / 2 - 2);
                    descriptorText.attr('y', nameBBox.height / 2 + 2);
                } else {
                    nameText.attr('y', 1);
                }

                // Add an icon at the bottom right of a rect when its branch is collapsed
                d3.select(this).append('image')
                    .attr('xlink:href', '/media/icons/collapsed-icon.svg') // Replace with the path to your icon
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', boxWidth / 2 - 5)
                    .attr('y', boxHeight / 2 - 5)
                    .attr('class', 'collapse-icon')
                    .attr('display', d._children ? 'block' : 'none');

                // Add a small thumbnail image above the rect for items with thumbnail: true
                if (d.data.thumbnail) {
                    d3.select(this).insert('image', ':first-child')
                        .attr('xlink:href', '/media/char-info/moses.svg') // Use the separate thumbnail image source
                        .attr('width', 40)
                        .attr('height', 40)
                        .attr('x', -20)
                        .attr('y', -boxHeight / 2 - 30)
                        .attr('class', 'thumbnail');
                }

                // Add images for king property
                if (d.data.king) {
                    let kingIcon;
                    switch (d.data.king) {
                        case 'united-israel':
                            kingIcon = '/media/family-tree/united-israel-icon.svg';
                            break;
                        case 'israel':
                            kingIcon = '/media/family-tree/israel-icon.svg';
                            break;
                        case 'judah':
                            kingIcon = '/media/family-tree/judah-icon.svg';
                            break;
                        default:
                            kingIcon = null;
                    }
                    if (kingIcon) {
                        d3.select(this).append('image')
                            .attr('xlink:href', kingIcon)
                            .attr('width', 30)
                            .attr('height', 30)
                            .attr('x', boxWidth / 2 - 15)
                            .attr('y', -boxHeight / 2 - 10)
                            .attr('class', 'king-icon');
                    }
                }
            }
        });

        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(200)
            .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
            .on('end', () => {
                isTransitioning = false; // Reset the transition flag when transition ends
            });

        nodeUpdate.select('.node-rect')
            .style('fill', function (d) {
                if (d3.select(this.parentNode).classed('hovered')) {
                    return nodeHoverColor;
                } else if (d.data.popup) {
                    return hasPopupColor; // Color for popup items
                }
                return backgroundColor; // Default color
            });

        // Update the icon visibility based on the collapsed state
        nodeUpdate.select('.collapse-icon')
            .attr('display', d => d._children ? 'block' : 'none')
            .attr('x', function (d) {
                const boxWidth = d3.select(this.parentNode).select('.node-rect').attr('width');
                return boxWidth / 2 - 5;
            })
            .attr('y', function (d) {
                const boxHeight = d3.select(this.parentNode).select('.node-rect').attr('height');
                return boxHeight / 2 - 5;
            });

        const nodeExit = node.exit().transition()
            .duration(200)
            .attr('transform', d => `translate(${source.x},${source.y}) scale(0)`)
            .remove();

        nodeExit.select('.node-rect')
            .attr('width', 160)
            .attr('height', 60);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        const link = svg.selectAll('path.link')
            .data(links, d => d.id);

        const linkEnter = link.enter().insert('path', "g")
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return elbow(o, o);
            });

        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(200)
            .attr('d', d => elbow(d, d.parent))
            .style('stroke', d => d.data.romanticRelation ? romanticRelationColor : (d.data.isDirectAncestor ? lineColor : lineColor))
            .style('stroke-dasharray', d => d.data.isDirectAncestor ? "0" : "4,4")
            .style('stroke-width', d => d.data.isDirectAncestor ? directAncestorWidth : (d.data.isStandAlone ? "0" : mainStrokeWidth)); // isStandAlone means the line to the parent won't be displayed

        const linkExit = link.exit().transition()
            .duration(200)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return elbow(o, o);
            })
            .remove();

        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Ensure isDirectAncestor lines stay on top but not above rects
        svg.selectAll('path.link')
            .filter(d => d.data.isDirectAncestor)
            .each(function () {
                this.parentNode.appendChild(this);
            });

        svg.selectAll('g.node').each(function () {
            this.parentNode.appendChild(this);
        });

        function elbow(s, d) {
            const children = d.children || [];
            const hasOnlyOneChild = children.length === 1;
            const isLeftChild = s.x < d.x;
            const isRightChild = s.x > d.x;
            const isFirstChild = children[0] === s;
            const isLastChild = children[children.length - 1] === s;
            const isMiddleChild = !isFirstChild && !isLastChild && !isLeftChild && !isRightChild;
            const isDirectAncestor = s.data && s.data.isDirectAncestor;
            const midY = (s.y + d.y) / 2;
            const radius = 10; // Adjust this value to change the roundness of the corners

            if (hasOnlyOneChild) {
                const radius = 0;

                return `M${s.x},${s.y}
                        V${midY - radius}
                        Q${s.x},${midY} ${s.x},${midY + radius}
                        V${d.y - radius}
                        Q${s.x},${d.y} ${s.x + Math.sign(d.x - s.x) * radius},${d.y}
                        H${d.x}`;
            }

            if (isDirectAncestor && isMiddleChild) {
                return `M${s.x},${s.y}
                        V${d.y}`;
            }

            if ((isDirectAncestor && (isLeftChild || isRightChild)) || isFirstChild || isLastChild) {
                const curveDirection = isLeftChild ? radius : -radius;
                return `M${s.x},${s.y}
                        V${midY + radius}
                        Q${s.x},${midY}
                         ${s.x + curveDirection},${midY}
                        H${d.x}
                        V${d.y}`;
            }

            if (isLeftChild) {
                return `M${s.x},${s.y}
                        V${midY + radius}
                        Q${s.x},${midY}
                         ${s.x + radius},${midY}`;
            }

            if (isRightChild) {
                return `M${s.x},${s.y}
                        V${midY + radius}
                        Q${s.x},${midY}
                         ${s.x - radius},${midY}`;
            }

            return `M${s.x},${s.y}
                    V${midY}
                    Q${s.x},${midY}
                     ${s.x},${midY}`;
        }

        function click(event, d) {
            if (isTransitioning) return;

            if (isMobile()) {
                if (d3.select(this).classed('hovered')) {
                    toggleChildren(d);
                    update(d);
                    updateConnectionLines();
                    panToNode(d);
                }
            } else {
                if (d.data.popup) {
                    toggleChildren(d);
                    update(d);
                    updateConnectionLines();
                    panToNode(d);
                } else {
                    // Hide the popup if another node without popup is clicked
                    popupDiv.transition()
                        .duration(200)
                        .on("end", () => popupDiv.style("display", "none"));

                    toggleChildren(d);
                    update(d);
                    updateConnectionLines();
                    panToNode(d);
                }
            }
        }

        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            isTransitioning = true; // Set the transition flag
        }

        function positionPopup(d, nodeElement) {
            const rect = nodeElement.select('.node-rect').node().getBoundingClientRect();
            const famTreeElement = document.getElementById("fam-tree");
            const famTreeRect = famTreeElement.getBoundingClientRect();

            // Get the current transform scale of #fam-tree
            const transform = d3.select("#fam-tree").style("transform");
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

            popupDiv.style("display", "block")
                .transition()
                .duration(200)

            popupDiv.html(createPopupContent(d))
                .style("left", `${(rect.right - famTreeRect.left) / scale - 10}px`) // Adjust the left position with the scale factor
                .style("top", `${(rect.top - famTreeRect.top) / scale - popupDiv.node().offsetHeight + 10}px`); // Adjust the top position with the scale factor
        }


        function mouseover(event, d) {
            const nodeElement = d3.select(this);
            // Change the color of the rectangle on hover
            nodeElement.select('.node-rect').style('fill', nodeHoverColor);

            // Show the popup
            if (d.data.popup) {
                positionPopup(d.data, nodeElement);
            }
        }

        function mouseout(event, d) {
            const nodeElement = d3.select(this);
            if (!popupDiv.node().contains(event.relatedTarget)) {
                // Revert the rectangle color
                nodeElement.select('.node-rect').style('fill', d.data.popup ? hasPopupColor : backgroundColor);

                // Make the popup disappear completely
                popupDiv.transition()
                    .duration(200)
                    .on("end", () => popupDiv.style("display", "none"));
            }
        }

        // Prevent popup from disappearing when hovering over it
        popupDiv.on('mouseover', function (event) {
            d3.select(this).transition()
                .duration(200)
        });

        popupDiv.on('mouseout', function (event) {
            if (!popupDiv.node().contains(event.relatedTarget)) {
                d3.select(this).transition()
                    .duration(200)
                    .on("end", () => popupDiv.style("display", "none"));
            }
        });

        function touchend(event, d) {
            if (isTransitioning) return; // Prevent interaction during transition

            event.preventDefault();
            const nodeElement = d3.select(this);
            let shouldPan = false; // Variable to track if panning is needed

            if (nodeElement.classed('hovered')) {
                // If the node is already hovered, just toggle its children
                if (d.children || d._children) {
                    shouldPan = true; // Set to true if children are being toggled
                }
                toggleChildren(d);
                update(d);
                updateConnectionLines();
            } else {
                // Remove .hovered class from all nodes
                svg.selectAll('g.node').classed('hovered', false);
                // Revert the rectangle color of all nodes
                svg.selectAll('.node-rect').style('fill', function (d) {
                    return d.data.popup ? hasPopupColor : backgroundColor; // Default color
                });

                // Add .hovered class to the current node
                nodeElement.classed('hovered', true);
                // Change rect color when hovered
                nodeElement.select('.node-rect').style('fill', nodeHoverColor);

                // Show or hide the popup
                if (d.data.popup) {
                    positionPopup(d.data, nodeElement);
                } else {
                    popupDiv.transition()
                        .duration(200)
                        .on("end", () => popupDiv.style("display", "none"));
                }
            }

            if (shouldPan) {
                panToNode(d); // Pan to the node if children were toggled
            }
        }




        // Hide popup and remove .hovered class when tapping outside on mobile
        document.body.addEventListener('touchstart', function (event) {
            if (!event.target.closest('g.node') && !event.target.closest('.fam-tree__popup')) {
                svg.selectAll('g.node').classed('hovered', false);
                svg.selectAll('.node-rect').style('fill', function (d) {
                    return d.data.popup ? hasPopupColor : backgroundColor; // Default color
                });
                popupDiv.style("display", "none");
            }
        }, true);






        function isMobile() {
            return /Mobi|Android/i.test(navigator.userAgent);
        }

        function createPopupContent(data) {
            let content = "<div style='display: flex; align-items: center;'>"; // popup class added at the top of this js
            if (data.thumbnail) {
                content += `<img src="${data.popupImageSrc}">`;
            }
            content += "<div class='fam-tree__popup__inner'>";
            content += `<h3>${data.name}</h3>`;
            content += "<ul>";
            data.popup.forEach(item => {
                content += `<li>${item}</li>`;
            });
            content += "</ul>";
            if (data.explore) {
                content += `<a class="btn" href="/character/moses">Explore</a>`;
            }
            content += "</div></div>";
            return content;
        }

        updateConnectionLines();
    }

    let i = 0;
    update(root);
});
