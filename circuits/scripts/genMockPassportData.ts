import { PassportData, PassportData_ECDSA } from "../../common/src/utils/types";
import { hash, assembleEContent, formatAndConcatenateDataHashes, formatMrz, hexToDecimal } from "../../common/src/utils/utils";
import * as forge from 'node-forge';
import * as secp256k1 from '@noble/secp256k1';

const sampleMRZ = "P<FRADUPONT<<ALPHONSE<HUGUES<ALBERT<<<<<<<<<24HB818324FRA0402111M3111115<<<<<<<<<<<<<<02"
const sampleDataHashes_256 = [
  [
    2,
    [-66, 82, -76, -21, -34, 33, 79, 50, -104, -120, -114, 35, 116, -32, 6, -14, -100, -115, -128, -8, 10, 61, 98, 86, -8, 45, -49, -46, 90, -24, -81, 38]
  ],
  [
    3,
    [0, -62, 104, 108, -19, -10, 97, -26, 116, -58, 69, 110, 26, 87, 17, 89, 110, -57, 108, -6, 36, 21, 39, 87, 110, 102, -6, -43, -82, -125, -85, -82]
  ],
  [
    11,
    [-120, -101, 87, -112, 111, 15, -104, 127, 85, 25, -102, 81, 20, 58, 51, 75, -63, 116, -22, 0, 60, 30, 29, 30, -73, -115, 72, -9, -1, -53, 100, 124]
  ],
  [
    12,
    [41, -22, 106, 78, 31, 11, 114, -119, -19, 17, 92, 71, -122, 47, 62, 78, -67, -23, -55, -42, 53, 4, 47, -67, -55, -123, 6, 121, 34, -125, 64, -114]
  ],
  [
    13,
    [91, -34, -46, -63, 62, -34, 104, 82, 36, 41, -118, -3, 70, 15, -108, -48, -100, 45, 105, -85, -15, -61, -71, 43, -39, -94, -110, -55, -34, 89, -18, 38]
  ],
  [
    14,
    [76, 123, -40, 13, 51, -29, 72, -11, 59, -63, -18, -90, 103, 49, 23, -92, -85, -68, -62, -59, -100, -69, -7, 28, -58, 95, 69, 15, -74, 56, 54, 38]
  ]
]

const sampleDataHashes_160 = [
  [
    2,
    [-66, 82, -76, -21, -34, 33, 79, 50, -104, -120, -114, 35, 116, -32, 6, -14, -100, -115, -128, -8]
  ],
  [
    3,
    [0, -62, 104, 108, -19, -10, 97, -26, 116, -58, 69, 110, 26, 87, 17, 89, 110, -57, 108, -6]
  ],
  [
    14,
    [76, 123, -40, 13, 51, -29, 72, -11, 59, -63, -18, -90, 103, 49, 23, -92, -85, -68, -62, -59]
  ]
]

const sampleTimeOfSig = [49, 15, 23, 13, 49, 57, 49, 50, 49, 54, 49, 55, 50, 50, 51, 56, 90]

export function genMockPassportData_sha256WithRSAEncryption_65537(): PassportData {
  const signatureAlgorithm = 'sha256WithRSAEncryption'
  const mrzHash = hash(signatureAlgorithm, formatMrz(sampleMRZ));
  sampleDataHashes_256.unshift([1, mrzHash]);
  const concatenatedDataHashes = formatAndConcatenateDataHashes(
    mrzHash,
    sampleDataHashes_256 as [number, number[]][],
  );

  const eContent = assembleEContent(
    hash(signatureAlgorithm, concatenatedDataHashes),
    sampleTimeOfSig,
  );

  const rsa = forge.pki.rsa;
  const privKey = rsa.generateKeyPair({ bits: 2048 }).privateKey;
  const modulus = privKey.n.toString(16);

  const md = forge.md.sha256.create();
  md.update(forge.util.binary.raw.encode(new Uint8Array(eContent)));

  const signature = privKey.sign(md)
  const signatureBytes = Array.from(signature, (c: string) => c.charCodeAt(0));

  return {
    mrz: sampleMRZ,
    signatureAlgorithm: signatureAlgorithm,
    pubKey: {
      modulus: hexToDecimal(modulus),
      exponent: '65537',
    },
    dataGroupHashes: concatenatedDataHashes,
    eContent: eContent,
    encryptedDigest: signatureBytes,
    photoBase64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjElEQVR42mL8//8/AyUYiBQYmIw3..."
  }
}

export function genMockPassportData_sha1WithRSAEncryption(): PassportData {
  const signatureAlgorithm = 'sha1WithRSAEncryption'
  const mrzHash = hash(signatureAlgorithm, formatMrz(sampleMRZ));
  sampleDataHashes_160.unshift([1, mrzHash]);
  const concatenatedDataHashes = formatAndConcatenateDataHashes(
    mrzHash,
    sampleDataHashes_160 as [number, number[]][],
  );

  const eContent = assembleEContent(
    hash(signatureAlgorithm, concatenatedDataHashes),
    sampleTimeOfSig,
  );

  const rsa = forge.pki.rsa;
  const privKey = rsa.generateKeyPair({ bits: 2048 }).privateKey;
  const modulus = privKey.n.toString(16);

  const md = forge.md.sha1.create();
  md.update(forge.util.binary.raw.encode(new Uint8Array(eContent)));

  const signature = privKey.sign(md)
  const signatureBytes = Array.from(signature, (c: string) => c.charCodeAt(0));

  return {
    mrz: sampleMRZ,
    signatureAlgorithm: signatureAlgorithm,
    pubKey: {
      modulus: hexToDecimal(modulus),
      exponent: '65537',
    },
    dataGroupHashes: concatenatedDataHashes,
    eContent: eContent,
    encryptedDigest: signatureBytes,
    photoBase64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjElEQVR42mL8//8/AyUYiBQYmIw3..."
  }
}

export function genMockPassportData_ecdsa_with_SHA256(): PassportData_ECDSA {
  const signatureAlgorithm = 'ecdsa-with-SHA256'
  const mrzHash = hash(signatureAlgorithm, formatMrz(sampleMRZ));
  sampleDataHashes_256.unshift([1, mrzHash]);
  const concatenatedDataHashes = formatAndConcatenateDataHashes(
    mrzHash,
    sampleDataHashes_256 as [number, number[]][],
  );
  const eContent = assembleEContent(
    hash(signatureAlgorithm, concatenatedDataHashes),
    sampleTimeOfSig,
  );
  const privKey = secp256k1.utils.randomPrivateKey();
  const pubKey = secp256k1.getPublicKey(privKey, false);
  const pub_x = pubKey.slice(1, 33);
  const pub_y = pubKey.slice(33, 65);
  const md = forge.md.sha256.create();
  md.update(forge.util.binary.raw.encode(new Uint8Array(eContent)));
  const digest = md.digest().getBytes();

  const signature = secp256k1.sign(digest, privKey).toCompactRawBytes();
  const sig_r = signature.slice(0, 32);
  const sig_s = signature.slice(32, 64);

  return {
    mrz: sampleMRZ,
    signatureAlgorithm: signatureAlgorithm,
    pubKey: { x: pub_x, y: pub_y },
    dataGroupHashes: concatenatedDataHashes,
    eContent: eContent,
    signature: { r: sig_r, s: sig_s },
    photoBase64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjElEQVR42mL8//8/AyUYiBQYmIw3...",
  };
}