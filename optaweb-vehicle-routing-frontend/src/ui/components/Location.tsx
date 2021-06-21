/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
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

import { Button, DataListCell, DataListItem, DataListItemRow, Tooltip,FormGroup,FormSelect,FormSelectOption } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { LatLangWithId } from 'store/route/types';

export interface LocationProps {
  id: number;
  description: string | null;
  requiredSkill: string;
  lat: number;
  lng: number;
  removeDisabled: boolean;
  removeHandler: (id: number) => void;
  selectHandler: (id: number) => void;
  updateHandler: (value: LatLangWithId,value1: any) => void;
}

const Location: React.FC<LocationProps> = ({
  id,
  description,
  requiredSkill,
  lat,
  lng,
  removeDisabled,
  removeHandler,
  selectHandler,
  updateHandler
}) => {
  const [clicked, setClicked] = React.useState(false);

  var options = [
    { value: 'blood preservation', label: 'Blood Preservation', disabled: false },
    { value: 'blood transfusion', label: 'Blood Transfusion', disabled: false },
    { value: 'depot', label: 'Depot', disabled: false },
    { value: 'vaccination', label: 'Vaccination', disabled: false },
    { value: 'testkit', label: 'Testkit', disabled: false }
    
  ];

  var latlangLoc : LatLangWithId = {
     locationid : id,
     description : description? description : "",
     requiredSkill : requiredSkill,
     lat : lat,
     lng: lng
  }

  function shorten(text: string) {
    const first = text.replace(/,.*/, '').trim();
    const short = first.substring(0, Math.min(20, first.length)).trim();
    if (short.length < first.length) {
      return `${short}...`;
    }
    return short;
  }

  return (
    <DataListItem
      isExpanded={false}
      aria-labelledby={`location-${id}`}
      onMouseEnter={() => selectHandler(id)}
      onMouseLeave={() => selectHandler(NaN)}
    >
      <DataListItemRow>
        <DataListCell isFilled>
          
          { (description && (
            <Tooltip content={description}>
              <span id={`location-${id}`}>{shorten(description)}</span>
            </Tooltip>
          ))
          || <span id={`location-${id}`}>{`Location ${id}`}</span>}
        </DataListCell>
        <DataListCell isFilled>
          <FormGroup label="Skill" fieldId="horizontal-form-title" >
              <FormSelect value={requiredSkill} onChange={ (e : any) => {updateHandler(latlangLoc,e)}}>
                {
                   options.map(function(option,index) {
                        return <FormSelectOption key={index} value={option.value} label={option.label} />
                    })
                }   
              </FormSelect>
          </FormGroup>
        </DataListCell>
        <DataListCell isFilled={false}>
          <Button
            type="button"
            variant="link"
            isDisabled={removeDisabled || clicked}
            onClick={() => {
              setClicked(true);
              removeHandler(id);
            }}
          >
            <TimesIcon />
          </Button>
        </DataListCell>
      </DataListItemRow>
    </DataListItem>
  );
};

export default Location;
