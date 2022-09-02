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

  /* async function getWallet() {
    const lucid = await Lucid.new(
      new Blockfrost(
        "https://cardano-testnet.blockfrost.io/api/v0",
        "mainnetbUyZDnp0NCCAkitKJk6jeiu28axzzpzG"
      ),
      "Testnet"
    );

    // Assumes you are in a browser environment
    const api = await window.cardano.nami.enable();
    lucid.selectWallet(api);

    const tx = await lucid
      .newTx()
      .payToAddress("addr...", { lovelace: 5000000n })
      .complete();

    const signedTx = await tx.sign().complete();

    const txHash = await signedTx.submit();

    console.log(txHash);
  } */

  const [onChainLoadout, setOnChainLoadout] = useState([]);
  const [transformedLoadout, setTransformedLoadout] = useState({});

  useEffect(() => {
    pollWallets();
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
  }, [isLoading, gotContent]);

  const myPromise = new Promise(
    (resolve) =>
      fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then((response) => response.json())
        .then((json) => setTimeout(() => resolve(json), 2000))
    // setTimeout just for the example , cause it will load quickly without it .
  );

  function shortenTokenLength(tokenName) {
    const tokenWords = tokenName.split(" ");
    let formattedItemName = "";
    for (let i = 4; i < tokenWords.length; i++) {
      formattedItemName +=
        tokenWords[i] + (i + 1 < tokenWords.length ? " " : "");
    }
    return formattedItemName;
  }

  function onWalletContent(walletContent, filtered, userLoadoutContentArray) {
    if (walletContent != {}) {
      setWalletContent(walletContent);
      if (Object.keys(filtered).length == 0) {
        setNoApe(true);
      } else {
        setFiltered(filtered);
      }
      if (userLoadoutContentArray.length == 0) {
        setNoLoadout(true);
      } else {
        setOnChainLoadout(userLoadoutContentArray);
        transformOnchainLoadout();
      }
      setGotContent(true);
    }
  }

  function getChangeAddy(changeAddress) {
    if (changeAddress) {
      setWalletAddress(truncate(changeAddress, 11));
    }
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
        //console.log(name);
        transformedLoad[name] = image;
      });
      setTransformedLoadout(transformedLoad);
    }
  }

  function handleRefresh() {
    setWalletContent({});
    setFiltered({});
    setGotContent(false);
    setIsLoading(true);
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

    ResetDustbins();
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

  const [droppedLoadoutNames, setDroppedLoadoutNames] = useState([]);
  function isDropped(boxName) {
    return droppedLoadoutNames.indexOf(boxName) > -1;
  }

  let user_loadout = {
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
  };

  const handleDrop1 = useCallback(
    (index, item, accepts) => {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        [accepts[0]]: item.name,
      }));
      user_loadout[accepts] = item;
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
        [accepts[0]]: item.name,
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
    (index, item, accepts) => {
      setUserLoadout((prevUserLoadout) => ({
        ...prevUserLoadout,
        [accepts[0]]: item.name,
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

  const notify = () => {
    toast.promise(myPromise, {
      pending: "We're submitting your loadout",
      success: "Loadout submitted",
      error: "error",
    });

    setLgShow(false);
  };

  return (
    <div className="homepage">
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
            />
            <Loading />
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
                  {walletAddress}
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
              disabled={!isConnected || noLoadout || noApe}
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
                      {capitalizeFirstLetter(key)} - {userLoadout[key]}{" "}
                    </p>
                  );
                })}
                <div className="modal-button ">
                  <Button
                    disabled={!apeSelected}
                    variant="success"
                    style={{
                      float: "right",
                      width: "150px",
                      height: "75px",
                      fontSize: "18px",
                      fontFamily: "Cabin, sans-serif",
                    }}
                    onClick={() => notify()}
                  >
                    Confirm
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>

        {/*  <Row style={{ marginTop: "-35px", float: "right" }}>
        
        </Row> */}

        {isConnected && !noLoadout ? (
          <div className="loadout">
            {onChainLoadout.length > 0 &&
              onChainLoadout.map(({ name, slot, amount, image }, index) => (
                <Row>
                  <Col>
                    <Box
                      name={name}
                      type={slot}
                      isDropped={isDropped(name)}
                      key={index}
                      img={image}
                    />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontWeight: "bold" }}> {slot} </p>
                      <p>
                        {" "}
                        {shortenTokenLength(name)} x{amount}{" "}
                      </p>
                    </div>
                  </Col>
                </Row>
              ))}
          </div>
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
                  onDrop={(item) => handleDrop1(index, item, accepts)}
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
                  accept={accepts}
                  lastDroppedItem={lastDroppedItem}
                  onDrop={(item) => handleDrop3(index, item, accepts)}
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
