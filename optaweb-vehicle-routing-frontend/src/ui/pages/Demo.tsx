/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  FlexModifiers,
  GutterSize,
  InputGroup,
  InputGroupText,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { MinusIcon, PlusIcon } from '@patternfly/react-icons';
import { backendUrl } from 'common';
import * as React from 'react';
import { connect } from 'react-redux';
import { clientOperations } from 'store/client';
import { UserViewport } from 'store/client/types';
import { demoOperations } from 'store/demo';
import { routeOperations } from 'store/route';
import { LatLangWithId, LatLng, Location, RouteWithTrack } from 'store/route/types';
import { AppState } from 'store/types';
import { DemoDropdown } from 'ui/components/DemoDropdown';
import LocationList from 'ui/components/LocationList';
import RouteMap from 'ui/components/RouteMap';
import SearchBox, { Result } from 'ui/components/SearchBox';
import { sideBarStyle } from 'ui/pages/common';
import { DistanceInfo, VehiclesInfo, VisitsInfo } from 'ui/pages/InfoBlock';
import { SimpleModal } from 'ui/modal/SimpleModal';


export const ID_CLEAR_BUTTON = 'clear-button';
export const ID_EXPORT_BUTTON = 'export-button';

export interface StateProps {
  distance: string;
  depot: Location | null;
  vehicleCount: number;
  visits: Location[];
  routes: RouteWithTrack[];
  isDemoLoading: boolean;
  boundingBox: [LatLng, LatLng] | null;
  userViewport: UserViewport;
  countryCodeSearchFilter: string[];
  demoNames: string[];
}

export interface DispatchProps {
  loadHandler: typeof demoOperations.requestDemo;
  clearHandler: typeof routeOperations.clearRoute;
  addLocationHandler: typeof routeOperations.addLocation;
  removeLocationHandler: typeof routeOperations.deleteLocation;
  updateLocationHandler: typeof routeOperations.updateLocation;
  addVehicleHandler: typeof routeOperations.addVehicle;
  removeVehicleHandler: typeof routeOperations.deleteAnyVehicle;
  updateViewport: typeof clientOperations.updateViewport;
}

const mapStateToProps = ({ plan, demo, serverInfo, userViewport }: AppState): StateProps => ({
  distance: plan.distance,
  vehicleCount: plan.vehicles.length,
  depot: plan.depot,
  visits: plan.visits,
  routes: plan.routes,
  isDemoLoading: demo.isLoading,
  boundingBox: serverInfo.boundingBox,
  countryCodeSearchFilter: serverInfo.countryCodes,
  // TODO use selector
  // TODO sort demos alphabetically?
  demoNames: (serverInfo.demos && serverInfo.demos.map((value) => value.name)) || [],
  userViewport
});

const mapDispatchToProps: DispatchProps = {
  loadHandler: demoOperations.requestDemo,
  clearHandler: routeOperations.clearRoute,
  addLocationHandler: routeOperations.addLocation,
  removeLocationHandler: routeOperations.deleteLocation,
  updateLocationHandler: routeOperations.updateLocation,
  addVehicleHandler: routeOperations.addVehicle,
  removeVehicleHandler: routeOperations.deleteAnyVehicle,
  updateViewport: clientOperations.updateViewport,
};

export type DemoProps = DispatchProps & StateProps;

export interface DemoState {
  selectedId: number;
  isModalOpen: boolean;
  currentEvent: any;
}

export class Demo extends React.Component<DemoProps, DemoState> {
 
  requiredSkill: string = "";
  options = [
    { value: 'blood preservation', label: 'Blood Preservation', disabled: false },
    { value: 'blood transfusion', label: 'Blood Transfusion', disabled: false },
    { value: 'depot', label: 'Depot', disabled: false },
    { value: 'vaccination', label: 'Vaccination', disabled: false },
    { value: 'testkit', label: 'Testkit', disabled: false }
    
  ];
  constructor(props: DemoProps) {
    super(props);

    this.state = {
      selectedId: NaN,
      isModalOpen: false,
      currentEvent: {}
    };
    this.handleDemoLoadClick = this.handleDemoLoadClick.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
    this.onSelectLocation = this.onSelectLocation.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.onConfirmSelection = this.onConfirmSelection.bind(this);
    this.handleUpdateLocation = this.handleUpdateLocation.bind(this);
  }

  
  onConfirmSelection(data : any)
  {
    console.log(data);
    console.log("Skill : " + data.skill);
    this.setState({isModalOpen: !this.state.isModalOpen});
    let description = data.address ? data.address : "";
    this.props.addLocationHandler({ ...data.eventData, description: description,requiredSkill: data.skill }); // TODO use reverse geocoding to find address
  }

  handleModalToggle()
  {
     this.setState({isModalOpen: !this.state.isModalOpen});
     console.log(this.state.isModalOpen);
  }

  openModal(e: any)
  {
    this.setState({isModalOpen: true,currentEvent: e});
  }


  handleMapClick(e: any) {
    //const rootElement = document.getElementById("root");
    console.log(e);
    this.openModal(e);
    //this.props.addLocationHandler({ ...e.latlng, description: '' }); // TODO use reverse geocoding to find address
  }

  handleAddLocation(e: any,skill: string)
  {
    this.props.addLocationHandler({ ...e.latlng, description: '' ,requiredSkill: skill});
  }

  handleUpdateLocation(latlangLoc : LatLangWithId,value : any)
  {
    latlangLoc.requiredSkill = value;
    this.props.updateLocationHandler(latlangLoc);
  }


  handleSearchResultClick(result: Result) {
    this.openModal(result);
    //this.props.addLocationHandler({ ...result.latLng, description: result.address,requiredSkill: 'test' });
  }

  handleDemoLoadClick(demoName: string) {
    this.props.loadHandler(demoName);
  }



  onSelectLocation(id: number) {
    this.setState({ selectedId: id });
  }

  render() {
    const { selectedId } = this.state;
    const {
      distance,
      depot,
      vehicleCount,
      visits,
      routes,
      demoNames,
      isDemoLoading,
      boundingBox,
      userViewport,
      countryCodeSearchFilter,
      addVehicleHandler,
      removeVehicleHandler,
      removeLocationHandler,
      clearHandler,
      updateViewport,
    } = this.props;

    const exportDataSet = () => {
      window.open(`${backendUrl}/api/dataset/export`);
    };

    return (
      <div>
      <SimpleModal canShow={this.state.isModalOpen} 
                   eventData={this.state.currentEvent} 
                   options={this.options} 
                   onConfirm={this.onConfirmSelection}
                   onClose={this.handleModalToggle}/>
      <Split gutter={GutterSize.md} style={{ overflowY: 'auto' }}>
        <SplitItem
          isFilled={false}
          style={sideBarStyle}
        >
          <TextContent>
            <Text component={TextVariants.h1}>Demo</Text>
          </TextContent>
          <SearchBox
            boundingBox={boundingBox}
            countryCodeSearchFilter={countryCodeSearchFilter}
            addHandler={this.handleSearchResultClick}
          />
          <LocationList
            depot={depot}
            visits={visits}
            removeHandler={removeLocationHandler}
            selectHandler={this.onSelectLocation}
            updateHandler={this.handleUpdateLocation}
          />
        </SplitItem>

        <SplitItem
          isFilled
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Flex breakpointMods={[{ modifier: FlexModifiers['justify-content-space-between'] }]}>
            <FlexItem>
              <Flex>
                <FlexItem>
                  <InputGroup>
                    <Button
                      variant={ButtonVariant.primary}
                      isDisabled={vehicleCount === 0}
                      onClick={removeVehicleHandler}
                    >
                      <MinusIcon />
                    </Button>
                    <InputGroupText readOnly>
                      {vehicleCount}
                    </InputGroupText>
                    <Button
                      variant={ButtonVariant.primary}
                      onClick={addVehicleHandler}
                      data-cy="demo-add-vehicle"
                    >
                      <PlusIcon />
                    </Button>
                  </InputGroup>
                </FlexItem>
                <FlexItem>
                  <VehiclesInfo />
                </FlexItem>
              </Flex>
            </FlexItem>
            <FlexItem>
              <VisitsInfo visitCount={visits.length} />
            </FlexItem>
            <FlexItem>
              <DistanceInfo distance={distance} />
            </FlexItem>
            <FlexItem>
              <Button
                id={ID_EXPORT_BUTTON}
                isDisabled={!depot || isDemoLoading}
                style={{ marginBottom: 16, marginLeft: 16 }}
                onClick={exportDataSet}
              >
                Export
              </Button>
              {(depot === null && (
                <DemoDropdown
                  demos={demoNames}
                  onSelect={this.handleDemoLoadClick}
                />
              )) || (
                <Button
                  id={ID_CLEAR_BUTTON}
                  isDisabled={isDemoLoading}
                  style={{ marginBottom: 16, marginLeft: 16 }}
                  onClick={clearHandler}
                  data-cy="demo-clear-button"
                >
                  Clear
                </Button>
              )}
            </FlexItem>
          </Flex>
          <RouteMap
            boundingBox={boundingBox}
            userViewport={userViewport}
            updateViewport={updateViewport}
            selectedId={selectedId}
            clickHandler={this.handleMapClick}
            removeHandler={removeLocationHandler}
            depot={depot}
            routes={routes}
            visits={visits}
          />
        </SplitItem>
      </Split>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Demo);
