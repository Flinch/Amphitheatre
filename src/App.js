import logo from "./logo.svg";
import "./App.css";
import "./SpinKit.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import update from "immutability-helper";
import { memo, useCallback, useState, useEffect } from "react";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes.js";
import { Dustbin } from "./Dustbin.js";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import king from "./images/king.png";
import society from "./images/Society.png";
import ra from "./images/ra.png";
import mo from "./images/mo.png";
import craftsman from "./images/craftsman.png";
import merchants from "./images/merchants.png";
import ape_green from "./images/green.jpeg";
import nyle from "./images/nyle.jpeg";
import maddo from "./images/maddo.jpeg";
import Loading from "./Loading.js";
import Connector from "./Connector.js";
import { RadioGroup, Radio } from "@blueprintjs/core";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownItemProps } from "react-bootstrap/DropdownItem";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactSearchBox from "react-search-box";
import SearchBar from "./SearchBar.js";
//import { Lucid, Blockfrost } from "lucid-cardano";
import {
  Address,
  BaseAddress,
  MultiAsset,
  Assets,
  ScriptHash,
  Costmdls,
  Language,
  CostModel,
  AssetName,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionOutput,
  Value,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionOutputBuilder,
  LinearFee,
  BigNum,
  encode_json_str_to_metadatum,
  GeneralTransactionMetadata,
  AuxiliaryData,
  BigInt,
  TransactionHash,
  TransactionInputs,
  TransactionInput,
  TransactionWitnessSet,
  Transaction,
  PlutusData,
  PlutusScripts,
  PlutusScript,
  PlutusList,
  Redeemers,
  Redeemer,
  RedeemerTag,
  Ed25519KeyHashes,
  ConstrPlutusData,
  ExUnits,
  Int,
  NetworkInfo,
  EnterpriseAddress,
  TransactionOutputs,
  hash_transaction,
  hash_script_data,
  hash_plutus_data,
  ScriptDataHash,
  Ed25519KeyHash,
  NativeScript,
  StakeCredential,
} from "@emurgo/cardano-serialization-lib-asmjs";
let Buffer = require("buffer/").Buffer;

function App() {
  const [dustbins_row1, setDustbins1] = useState([
    { accepts: [ItemTypes.HEAD], lastDroppedItem: null },
    { accepts: [ItemTypes.BODY], lastDroppedItem: null },
    { accepts: [ItemTypes.CAPE], lastDroppedItem: null },
  ]);

  const [dustbins_row2, setDustbins2] = useState([
    { accepts: [ItemTypes.GLOVES], lastDroppedItem: null },
    { accepts: [ItemTypes.LEG], lastDroppedItem: null },
    { accepts: [ItemTypes.HORSE], lastDroppedItem: null },
  ]);

  const [dustbins_row3, setDustbins3] = useState([
    { accepts: [ItemTypes.ITEM0], lastDroppedItem: null },
    { accepts: [ItemTypes.ITEM1], lastDroppedItem: null },
    { accepts: [ItemTypes.ITEM2], lastDroppedItem: null },
    { accepts: [ItemTypes.ITEM3], lastDroppedItem: null },
    { accepts: [ItemTypes.HORSEHARNESS], lastDroppedItem: null },
  ]);

  var truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || "...";

    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    return (
      fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars)
    );
  };
  const [beenHere, setBeenHere] = useState(false);
  const [refreshToken, setRefreshToken] = useState(false);
  const [postedTransactions, setPostedTransactions] = useState([]);
  const [lookup, setLookup] = useState({});
  const [txHash, setTxHash] = useState(undefined);
  const [utxoSpent, setUtxoSpent] = useState(TransactionUnspentOutputs.new());
  const [whichWallet, setWhichWallet] = useState("");
  const [wallets, setWallets] = useState([]);
  const [term, setTerm] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noApe, setNoApe] = useState(false);
  const [noLoadout, setNoLoadout] = useState(false);
  const [walletAddress, setWalletAddress] = useState("No address set");
  const [walletContent, setWalletContent] = useState({});
  /* const [imageContent, setImageContent] = useState({}); */
  const [filtered, setFiltered] = useState({});
  const [gotContent, setGotContent] = useState(false);
  const [societyToken, setSocietyToken] = useState(0);
  const [lgShow, setLgShow] = useState(false);
  const [lgShowLoad, setLgShowLoad] = useState(false);
  const [apeSelected, setApeSelected] = useState(false);
  const [userLoadout, setUserLoadout] = useState({
    Head: "",
    Body: "",
    Cape: "",
    Gloves: "",
    Leg: "",
    Item0: "",
    Item1: "",
    Item2: "",
    Item3: "",
    Horse: "",
    HorseHarness: "",
    Ape: "",
  });
  const [userLoadoutValues, setUserLoadoutValues] = useState({});
  const [searchList, setSearchList] = useState([]);

  let protocolParams = {
    linearFee: {
      minFeeA: "44",
      minFeeB: "155381",
    },
    minUtxo: "34482",
    poolDeposit: "500000000",
    keyDeposit: "2000000",
    maxValSize: 5000,
    maxTxSize: 16384,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    coinsPerUtxoWord: "34482",
  };

  let API = undefined;
  const lovelaceToSend = 1001001;

  const [onChainLoadout, setOnChainLoadout] = useState([]);
  const [transformedLoadout, setTransformedLoadout] = useState({});

  useEffect(() => {
    pollWallets();
    lookupFunction();
    if (!apeSelected && Object.keys(filtered).length != 0) {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        Ape: Object.keys(filtered)[0].slice(5),
      }));
      setApeSelected(true);
    }
    if (isLoading && gotContent) {
      simulateNetworkRequest().then(() => {
        setIsConnected(true);
        setIsLoading(false);
        ResetDustbins();
      });
    }
  }, [isLoading, gotContent, userLoadout]);

  function shortenTokenLength(tokenName) {
    const tokenWords = tokenName.split(" ");
    let formattedItemName = "";
    for (let i = 4; i < tokenWords.length; i++) {
      formattedItemName +=
        tokenWords[i] + (i + 1 < tokenWords.length ? " " : "");
    }
    return formattedItemName;
  }

  function onWalletContent(
    walletContent,
    filtered,
    userLoadoutContentArray,
    txUnspentOutput
  ) {
    if (walletContent != {}) {
      setWalletContent(walletContent);
      if (txUnspentOutput) {
        setUtxoSpent(txUnspentOutput);
      }
      if (Object.keys(filtered).length == 0) {
        setNoApe(true);
      } else {
        setNoApe(false);
        setFiltered(filtered);
      }
      if (userLoadoutContentArray.length == 0) {
        setNoLoadout(true);
      } else {
        setNoLoadout(false);
        setOnChainLoadout(userLoadoutContentArray);
        setSearchList(userLoadoutContentArray);
        transformOnchainLoadout();
      }
      setGotContent(true);
    }
  }

  function getTransactionsPosted(postedTransactions) {
    if (postedTransactions && !beenHere) {
      setBeenHere(true);
      setPostedTransactions(postedTransactions.reverse());
    }
  }

  function getChangeAddy(changeAddress) {
    if (changeAddress) {
      setWalletAddress(changeAddress);
    }
    /* if (changeAddress === walletAddress || walletAddress === "") {
      setWalletAddress(changeAddress);
    } else if (changeAddress !== walletAddress) {
      setWalletAddress(changeAddress);
      ResetDustbins();
      setUserLoadoutValues({});
      setUserLoadout({
        Head: "",
        Body: "",
        Cape: "",
        Gloves: "",
        Leg: "",
        Item0: "",
        Item1: "",
        Item2: "",
        Item3: "",
        Horse: "",
        HorseHarness: "",
        Ape: "",
      });
    }*/
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function simulateNetworkRequest() {
    if (walletContent["SOCIETY"] != undefined)
      setSocietyToken(
        numberWithCommas(Math.trunc(walletContent["SOCIETY"] / 1000000))
      );
    else {
      setSocietyToken(0);
    }
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleLoadout() {
    setLgShowLoad(true);
  }

  function onTermChange(event) {
    setTerm(event.target.value);
  }

  function onSubmitAddy(event) {
    setIsLoading(true);
  }

  function transformOnchainLoadout() {
    let transformedLoad = {};
    if (onChainLoadout != {}) {
      onChainLoadout.map(({ name, type, amount, image }, index) => {
        transformedLoad[name] = image;
      });
      setTransformedLoadout(transformedLoad);
    }
  }

  function handleEditWallet() {
    setIsConnected(false);
    setIsLoading(false);
    setNoLoadout(false);
    setNoApe(false);
    setGotContent(false);
    setApeSelected(false);
    setWalletContent({});
    setFiltered({});
    setBeenHere(false);
    setUserLoadout({
      Head: "",
      Body: "",
      Cape: "",
      Gloves: "",
      Leg: "",
      Item0: "",
      Item1: "",
      Item2: "",
      Item3: "",
      Horse: "",
      HorseHarness: "",
      Ape: "",
    });
    setUserLoadoutValues({});
  }
  function lookupFunction() {
    var lookup = {};
    for (var i = 0, len = onChainLoadout.length; i < len; i++) {
      lookup[onChainLoadout[i].name] = onChainLoadout[i];
    }
    setLookup(lookup);
  }

  function ResetDustbins() {
    setDustbins1([
      { accepts: [ItemTypes.HEAD], lastDroppedItem: null },
      { accepts: [ItemTypes.BODY], lastDroppedItem: null },
      { accepts: [ItemTypes.CAPE], lastDroppedItem: null },
    ]);
    setDustbins2([
      { accepts: [ItemTypes.GLOVES], lastDroppedItem: null },
      { accepts: [ItemTypes.LEG], lastDroppedItem: null },
      { accepts: [ItemTypes.HORSE], lastDroppedItem: null },
    ]);
    setDustbins3([
      { accepts: [ItemTypes.ITEM0], lastDroppedItem: null },
      { accepts: [ItemTypes.ITEM1], lastDroppedItem: null },
      { accepts: [ItemTypes.ITEM2], lastDroppedItem: null },
      { accepts: [ItemTypes.ITEM3], lastDroppedItem: null },
      { accepts: [ItemTypes.HORSEHARNESS], lastDroppedItem: null },
    ]);
  }

  let loadoutValues = {};

  const [droppedLoadoutNames, setDroppedLoadoutNames] = useState([]);
  function isDropped(boxName) {
    return droppedLoadoutNames.indexOf(boxName) > -1;
  }

  function getLoadoutTotals() {
    let leg_armor = 0;
    let arm_armor = 0;
    let head_armor = 0;
    let body_armor = 0;
    let weight = 0;
    if (userLoadoutValues != {}) {
      Object.keys(userLoadoutValues).map((key, index) => {
        leg_armor += parseInt(userLoadoutValues[key]?.leg_armor || 0);
        arm_armor += parseInt(userLoadoutValues[key]?.arm_armor || 0);
        head_armor += parseInt(userLoadoutValues[key]?.head_armor || 0);
        body_armor += parseInt(userLoadoutValues[key]?.body_armor || 0);
        weight += parseInt(userLoadoutValues[key]?.weight || 0);
      });
    }
    return {
      leg: leg_armor,
      arm: arm_armor,
      head: head_armor,
      body: body_armor,
      weight: weight,
    };
  }

  const handleDrop1 = useCallback(
    (index, item, accepts) => {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        [accepts[0]]: shortenTokenLength(item.name),
      }));
      setUserLoadoutValues((prevUserLoadout) => ({
        ...prevUserLoadout,
        [lookup[item.name]?.slot]: lookup[item.name],
      }));

      const { name } = item;

      setDroppedLoadoutNames(
        update(droppedLoadoutNames, name ? { $push: [name] } : { $push: [] })
      );

      setDustbins1(
        update(dustbins_row1, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedLoadoutNames, dustbins_row1]
  );

  const handleDrop2 = useCallback(
    (index, item, accepts) => {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        [accepts[0]]: shortenTokenLength(item.name),
      }));
      setUserLoadoutValues((prevUserLoadout) => ({
        ...prevUserLoadout,
        [lookup[item.name]?.slot]: lookup[item.name],
      }));
      const { name } = item;
      const { amount } = item;
      setDroppedLoadoutNames(
        update(
          droppedLoadoutNames,
          name && amount ? { $push: [name], $push: [amount] } : { $push: [] }
        )
      );
      setDustbins2(
        update(dustbins_row2, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedLoadoutNames, dustbins_row2]
  );

  const handleDrop3 = useCallback(
    /* camel */
    (index, item, accepts) => {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        [accepts[0]]: shortenTokenLength(item.name),
      }));
      setUserLoadoutValues((prevUserLoadout) => ({
        ...prevUserLoadout,
        [lookup[item.name]?.slot]: lookup[item.name],
      }));
      const { name } = item;
      setDroppedLoadoutNames(
        update(droppedLoadoutNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins3(
        update(dustbins_row3, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedLoadoutNames, dustbins_row3]
  );

  function apeUpdateInfo(event) {
    setApeSelected(true);
    setUserLoadout((prevUserLoadout) => ({
      ...prevUserLoadout,
      Ape: Object.keys(filtered)[event].slice(5),
    }));
  }

  function handleWalletSelect(val) {
    const whichWalletSelected = val.target.text;

    setWhichWallet(whichWalletSelected);
  }

  function handleIsError(error) {
    if (error) {
      toast.error("Error connecting to wallet. Please try again", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setIsLoading(false);
      setIsConnected(false);
    }
  }

  function pollWallets(count = 0) {
    const wallets = [];
    for (const key in window.cardano) {
      if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
      }
    }
    if (wallets.length === 0 && count < 3) {
      setTimeout(() => {
        pollWallets(count + 1);
      }, 1000);
      return;
    }

    setWallets(wallets);
  }

  const notifyError = () => {
    toast.error(
      "Something went wrong. Plese refresh and try again. Make sure you have enough ada in your wallet to cover your assets in change address.",
      {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    setLgShow(false);
  };

  const notify = () => {
    toast.success("Transaction submitted. Please check your wallet.", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setLgShow(false);
    //setRefreshToken(true);
  };

  /*  const notifyRefresh = () => {
    const refreshContent = toast.loading(
      "We are fetching your latest onchain loadout. Please hold."
    );
  }; */

  const enableWallet = async () => {
    const walletKey = whichWallet;
    try {
      API = await window.cardano[walletKey].enable();
    } catch (err) {
      console.log(err);
      notifyError();
    }
  };

  const initTransactionBuilder = async () => {
    const txBuilder = TransactionBuilder.new(
      TransactionBuilderConfigBuilder.new()
        .fee_algo(
          LinearFee.new(
            BigNum.from_str(protocolParams.linearFee.minFeeA),
            BigNum.from_str(protocolParams.linearFee.minFeeB)
          )
        )
        .pool_deposit(BigNum.from_str(protocolParams.poolDeposit))
        .key_deposit(BigNum.from_str(protocolParams.keyDeposit))
        .coins_per_utxo_word(BigNum.from_str(protocolParams.coinsPerUtxoWord))
        .max_value_size(protocolParams.maxValSize)
        .max_tx_size(protocolParams.maxTxSize)
        .prefer_pure_change(true)
        .build()
    );

    return txBuilder;
  };

  const buildSendADATransaction = async () => {
    try {
      await enableWallet();
      const generalMetadata = GeneralTransactionMetadata.new();
      const auxiliaryData = AuxiliaryData.new();
      const txBuilder = await initTransactionBuilder();
      const shelleyOutputAddress = Address.from_bech32(walletAddress);
      const shelleyChangeAddress = Address.from_bech32(walletAddress);

      generalMetadata.insert(
        BigNum.from_str("674"),
        encode_json_str_to_metadatum(JSON.stringify(userLoadout))
      );

      if (generalMetadata.len() > 0) {
        auxiliaryData.set_metadata(generalMetadata);
      }

      if (auxiliaryData) {
        txBuilder.set_auxiliary_data(auxiliaryData);
      }

      txBuilder.add_output(
        TransactionOutput.new(
          shelleyOutputAddress,
          Value.new(BigNum.from_str(lovelaceToSend.toString()))
        )
      );

      // Find the available UTXOs in the wallet and
      // us them as Inputs
      const txUnspentOutputs = utxoSpent;
      txBuilder.add_inputs_from(txUnspentOutputs, 0);

      // calculate the min fee required and send any change to an address
      txBuilder.add_change_if_needed(shelleyChangeAddress);

      // once the transaction is ready, we build it to get the tx body without witnesses
      const txBody = txBuilder.build();

      // Tx witness
      const transactionWitnessSet = TransactionWitnessSet.new();

      const tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
        txBuilder.get_auxiliary_data()
      );

      let txVkeyWitnesses = await API.signTx(
        Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
        true
      );

      console.log(txVkeyWitnesses);

      txVkeyWitnesses = TransactionWitnessSet.from_bytes(
        Buffer.from(txVkeyWitnesses, "hex")
      );

      transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

      const signedTx = Transaction.new(
        tx.body(),
        transactionWitnessSet,
        tx.auxiliary_data()
      );

      const submittedTxHash = await API.submitTx(
        Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
      );

      if (submittedTxHash) {
        await setTxHash(submittedTxHash);
        notify();
      }
      console.log(submittedTxHash);
    } catch (error) {
      console.log(error);
      notifyError();
    }
  };

  let acceptsItem = ["Item"];

  function OnInputSubmit(term) {
    const List = onChainLoadout.filter((obj) => {
      if (
        obj["name"].toLowerCase().includes(term) ||
        obj["slot"].toLowerCase().includes(term)
      ) {
        return obj;
      }
    });
    setSearchList(List);
  }

  return (
    <div className="homepage">
      {/*
        <ReactAudioPlayer
          src="http://docs.google.com/uc?export=open&id=1g0-HJ2l1bHvuEIBqiASD5JEn08bNHRY9"
          autoPlay
          controls
        />
      */}
      <ToastContainer
        position="top-left"
        bodyClassName="toastBody"
        progressClassName="toastBody"
      />
      <Container>
        {isLoading ? (
          <div>
            {" "}
            <Connector
              walletContent={onWalletContent}
              getChange={getChangeAddy}
              filtered={onWalletContent}
              whichWalletSet={whichWallet}
              isError={handleIsError}
              userLoadoutContentArray={onWalletContent}
              getTransactions={getTransactionsPosted}
            />
            {!refreshToken ? <Loading /> : ""}
          </div>
        ) : (
          ""
        )}

        <Row style={{ paddingTop: "10px" }}>
          <Col>
            {wallets ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="buttons_tas"
                  id="dropdown-basic"
                  style={{
                    marginLeft: `${isConnected ? "0" : "95px"}`,
                    fontFamily: "Cabin",
                  }}
                >
                  Wallet: {capitalizeFirstLetter(whichWallet)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {wallets.map((val) => {
                    console.log();
                    return (
                      <Dropdown.Item
                        key={val}
                        onClick={(val) => {
                          handleWalletSelect(val);
                        }}
                      >
                        <img
                          src={window.cardano[val].icon}
                          width={24}
                          height={24}
                        />
                        {val}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              ""
            )}
          </Col>
          <Col
            style={{
              position: `${!isConnected ? "absolute" : "relative"}`,
              width: "auto",
            }}
          >
            {isConnected ? (
              <div style={{ fontSize: "16px", paddingTop: "3px" }}>
                <img src={society} style={{ width: "35px" }} />
                <span
                  style={{ color: "wheat", fontFamily: "Cabin, sans-serif" }}
                >
                  {" "}
                  {societyToken} |{" "}
                </span>
                <span
                  style={{
                    color: "wheat",
                    paddingRight: "10px",
                    fontSize: "",
                    fontFamily: "Cabin, sans-serif",
                  }}
                >
                  {truncate(walletAddress, 11)}
                </span>
                <span>
                  {" "}
                  <Button
                    variant="light"
                    onClick={handleEditWallet}
                    className="buttons_tas"
                  >
                    <p>Disconnect</p>
                  </Button>{" "}
                </span>
                <span>
                  <Button
                    variant="light"
                    onClick={handleLoadout}
                    className="buttons_tas"
                  >
                    <p>Loadouts</p>
                  </Button>
                </span>
              </div>
            ) : (
              <Button
                onClick={onSubmitAddy}
                variant="outline-secondary"
                id="button-addon1"
                style={{
                  color: "white",
                  background: "#2b802b",
                  marginLeft: "",
                }}
                disabled={!whichWallet}
              >
                Connect
              </Button>
            )}
          </Col>
          <Col>
            {" "}
            <Button
              disabled={!isConnected}
              variant="success"
              style={{
                float: "right",
                width: "150px",
                height: "100px",
                fontSize: "18px",
              }}
              onClick={() => {
                setLgShow(true);
              }}
            >
              <p style={{ color: "white" }}> Go To War </p>
            </Button>{" "}
            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Body bsPrefix="modal-bg">
                <div
                  className="modal-title"
                  style={{ fontFamily: "Cabin, sans-serif" }}
                >
                  <h2> Confirm your selection </h2>
                </div>
                {Object.keys(userLoadout).map((key, index) => {
                  return (
                    <p
                      key={index}
                      style={{
                        paddingTop: "5px",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      {capitalizeFirstLetter(key)} - {userLoadout[key]}
                    </p>
                  );
                })}{" "}
                <div class="armor">
                  <p> Arm Armor: {getLoadoutTotals()["arm"]} </p>{" "}
                  <p> Head Armor: {getLoadoutTotals()["head"]} </p>{" "}
                  <p> Body Armor: {getLoadoutTotals()["body"]} </p>{" "}
                  <p> Leg Armor: {getLoadoutTotals()["leg"]} </p>{" "}
                  <p> Weight: {getLoadoutTotals()["weight"]} </p>{" "}
                </div>
                <div className="modal-button ">
                  <Button
                    variant="success"
                    style={{
                      float: "right",
                      width: "150px",
                      height: "75px",
                      fontSize: "18px",
                      fontFamily: "Cabin, sans-serif",
                    }}
                    onClick={() => buildSendADATransaction()}
                  >
                    Confirm
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              size="lg"
              show={lgShowLoad}
              onHide={() => setLgShowLoad(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Body bsPrefix="modal-bg">
                <div
                  className="modal-title"
                  style={{ fontFamily: "Cabin, sans-serif" }}
                >
                  <h2 style={{ paddingBottom: "30px" }}>
                    {" "}
                    Your On-Chain Loadouts{" "}
                  </h2>
                  {postedTransactions.map((key, index) => {
                    return (
                      <a
                        href={`https://cardanoscan.io/transaction/${key}?tab=metadata`}
                        target="_blank"
                      >
                        <p style={{ fontSize: "16px" }}>{key}</p>
                        <br />
                      </a>
                    );
                  })}
                </div>
                <div className="modal-button" style={{ paddingTop: "0px" }}>
                  <Button
                    className="buttons_tas"
                    style={{
                      float: "right",
                      width: "100px",
                      height: "50px",
                      fontSize: "18px",
                      fontFamily: "Cabin, sans-serif",
                    }}
                    onClick={() => setLgShowLoad(false)}
                  >
                    Close
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>

        {/*  <Row style={{ marginTop: "-35px", float: "right" }}>
        
        </Row> */}

        {isConnected && !noLoadout ? (
          <div>
            <div className="loadout">
              <SearchBar OnInputSubmit={OnInputSubmit} />
              {searchList.length > 0 &&
                searchList.map(
                  (
                    {
                      name,
                      slot,
                      amount,
                      image,
                      weight,
                      leg_armor,
                      body_armor,
                      head_armor,
                      arm_armor,
                    },
                    index
                  ) => (
                    <Row style={{ justifyContent: "center", display: "grid" }}>
                      <Col>
                        <Box
                          name={name}
                          type={slot}
                          isDropped={isDropped(name)}
                          key={index}
                          img={image}
                        />
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontWeight: "bold" }}> [{slot}] </p>
                          <p
                            style={{
                              fontSize: "16px",
                              width: "100px",
                              overflow: "initial",
                              fontWeight: "500",
                            }}
                          >
                            {" "}
                            {shortenTokenLength(name)}{" "}
                          </p>
                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {`Qunatity: ${amount}`}{" "}
                          </p>

                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {leg_armor ? `Leg armor: ${leg_armor}` : ""}{" "}
                          </p>
                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {body_armor ? `Body armor: ${body_armor}` : ""}{" "}
                          </p>
                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {head_armor ? `Head armor: ${head_armor}` : ""}{" "}
                          </p>
                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {arm_armor ? `Arm armor: ${arm_armor}` : ""}{" "}
                          </p>
                          <p style={{ fontSize: "12.5px" }}>
                            {" "}
                            {weight ? `Weight: ${weight}` : ""}{" "}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )
                )}
            </div>
          </div>
        ) : (
          ""
        )}
        {isConnected ? (
          <Row>
            <Col>
              <div class="armor-top ">
                <p> Arm: {getLoadoutTotals()["arm"]} </p>{" "}
                <p> Head: {getLoadoutTotals()["head"]} </p>{" "}
                <p> Body: {getLoadoutTotals()["body"]} </p>{" "}
                <p> Leg: {getLoadoutTotals()["leg"]} </p>{" "}
                <p> Weight: {getLoadoutTotals()["weight"]} </p>{" "}
              </div>
            </Col>
          </Row>
        ) : (
          ""
        )}

        {noLoadout ? (
          <div className="loadout_no_gear">
            <Row>
              <Col>
                <h2 style={{ textAlign: "center", marginTop: "100px" }}>
                  {" "}
                  No Gear Found{" "}
                </h2>
              </Col>
            </Row>
          </div>
        ) : (
          ""
        )}

        {isConnected && !noApe ? (
          <Row>
            <Col>
              <div className="big_box">
                <Carousel
                  width="426px"
                  showIndicators={false}
                  onChange={apeUpdateInfo}
                  onClickItem={apeUpdateInfo}
                >
                  {filtered
                    ? Object.keys(filtered) &&
                      Object.keys(filtered).map((val, index) => {
                        //console.log(val);
                        return <img src={filtered[val]} key={index} />;
                      })
                    : ""}
                </Carousel>
              </div>
            </Col>
          </Row>
        ) : (
          ""
        )}

        {noApe ? (
          <Row>
            <Col>
              <div className="big_box_noApe">
                <h2 style={{ marginTop: "186px" }}> No ape found </h2>
              </div>
            </Col>
          </Row>
        ) : (
          ""
        )}
        {isConnected ? (
          <Row style={{ width: "40%", marginTop: "-383px" }}>
            {dustbins_row1.map(({ accepts, lastDroppedItem }, index) => (
              <Col>
                <Dustbin
                  accept={accepts}
                  lastDroppedItem={lastDroppedItem}
                  onDrop={(item) => {
                    handleDrop1(index, item, accepts);
                  }}
                  key={index}
                  img={
                    lastDroppedItem
                      ? transformedLoadout[lastDroppedItem["name"]]
                      : ""
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          ""
        )}

        {isConnected ? (
          <Row style={{ width: "40%", marginTop: "80px" }}>
            {dustbins_row2.map(({ accepts, lastDroppedItem }, index) => (
              <Col>
                <Dustbin
                  accept={accepts}
                  lastDroppedItem={lastDroppedItem}
                  onDrop={(item) => handleDrop2(index, item, accepts)}
                  key={index}
                  img={
                    lastDroppedItem
                      ? transformedLoadout[lastDroppedItem["name"]]
                      : ""
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          ""
        )}
        {isConnected ? (
          <Row style={{ width: "80%", marginTop: "100px" }}>
            {dustbins_row3.map(({ accepts, lastDroppedItem }, index) => (
              <Col>
                <Dustbin
                  accept={
                    accepts[0] === "Item0" ||
                    accepts[0] === "Item1" ||
                    accepts[0] === "Item2" ||
                    accepts[0] === "Item3"
                      ? acceptsItem
                      : accepts
                  }
                  lastDroppedItem={lastDroppedItem}
                  onDrop={(item) => {
                    if (
                      accepts === "Item0" ||
                      accepts === "Item1" ||
                      accepts === "Item2" ||
                      accepts === "Item3"
                    ) {
                      accepts = "Item";
                    }

                    handleDrop3(index, item, accepts);
                  }}
                  key={index}
                  img={
                    lastDroppedItem
                      ? transformedLoadout[lastDroppedItem["name"]]
                      : ""
                  }
                />
                {console.log(acceptsItem[0])}
              </Col>
            ))}
          </Row>
        ) : (
          ""
        )}

        {!isConnected && !isLoading ? (
          <div>
            {" "}
            <h1
              style={{
                color: "wheat",
                fontFamily: "Cabin, sans-serif",
              }}
              className="sk-grid-position"
            >
              {" "}
              Connect your wallet to continue{" "}
            </h1>{" "}
          </div>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
}

export default App;
