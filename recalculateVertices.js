// this function recalculates and updates the vertices of a given skinned mesh
function recalculateVertices (skinnedMesh) {
	var cleanVertices = [];

	for (var i = 0; i < skinnedMesh.geometry.vertices.length; i++) {
		cleanVertices.push(skinnedMesh.geometry.vertices[i].clone());
	}
	var newVerts = [];
	var sIndices = skinnedMesh.geometry.skinIndices;
	var sWeights = skinnedMesh.geometry.skinWeights;

	for (var i = 0; i < cleanVertices.length; i++) {
		var cVert = cleanVertices[i].clone().applyMatrix4(skinnedMesh.bindMatrix),
			sI = sIndices[i],
			sW = sWeights[i],
			bones = [],
			pos = new THREE.Vector3(0, 0, 0),
			tempVector = new THREE.Vector3(0, 0, 0),
			tempMatrix = new THREE.Matrix4();
		bones[0] = sI.x;
		bones[1] = sI.y;
		bones[2] = sI.z;
		bones[3] = sI.w;

		for (var j = 0; j < 4; j++) {
			tempMatrix.multiplyMatrices(skinnedMesh.skeleton.bones[bones[j]].matrixWorld, skinnedMesh.skeleton.boneInverses[bones[j]]);
			pos.add(tempVector.copy(cVert).applyMatrix4(tempMatrix).multiplyScalar(sW.getComponent(j)));
		}
		newVerts.push(pos);
	}
	skinnedMesh.geometry.vertices = newVerts;
}